import json
import logging
from asyncpg.pool import Pool
from pkg.utils.auth_helper import AuthHelper
from pkg.utils.strgen import StringGenerator
from pkg.app import app


class PoolAcquireContext:
    _pool = None
    _conn = None
    _num_retries = None

    def __init__(self, pool: Pool, num_retries=5):
        self._pool = pool
        self._num_retries = num_retries

    # Если после создания пула Postgres был перезапущен, то имеющиеся соединения в пуле будут закыты.
    # По умолчанию оно там одно, поэтому при первой попытке обратиться к базе вылетит ошибка
    #    asyncpg.exceptions._base.InterfaceError: connection is closed
    # однако, при повторной попытке пул произведёт реконнект и выдаст нормальное соединение.
    # Этим мы и воспользуемся
    async def __aenter__(self):
        conn = None
        if not self._conn:
            for _ in range(self._num_retries):
                conn = await self._pool.acquire()
                if not conn.is_closed():
                    self._conn = conn
                    return conn
                else:
                    await self._pool.release(conn)
        # Если все коннекты окажутся закрытыми, вернём последний найденный
        # Если что-то пошло совсем не так, то вернётся None и мы перехватим ошибку выше
        return conn

    async def __aexit__(self, exc_type, exc, tb):
        if self._conn and self._pool:
            conn = self._conn
            self._conn = None
            await self._pool.release(conn)

    def __await__(self):
        return self.__aenter__().__await__()


class PoolProxy:
    _pool = None

    def __init__(self, pool: Pool):
        self._pool = pool

    def acquire(self, num_retries=5):
        return PoolAcquireContext(self._pool, num_retries)


class Executor:
    _http_request = None
    _log_full_sql_result = True

    def __init__(self, http_request, log_full_sql_result=True):
        self._http_request = http_request
        self._log_full_sql_result = log_full_sql_result

    async def _setup_db_values(self, conn):
        jwt = AuthHelper().get_jwt_from_request(self._http_request)
        user_id = jwt['id'] if jwt else 0

        logger = logging.getLogger('postgres')
        logger.info(f'Setup user id: {user_id}')

        statement = await conn.prepare(app.db_queries['set_user_id'])
        await statement.fetchval(user_id)

    async def _query(self, only_one, sql, *args):
        if app.pool:
            async with PoolProxy(app.pool).acquire() as conn:
                await self._setup_db_values(conn)

                # TODO: Запоминать этот ID запроса в базе
                rand_id = StringGenerator(r'[\u\d]{8}').render()
                logger = logging.getLogger('postgres')
                arg = f'\nARGS: {[*args]}' if args else ''
                log_sql = sql.replace('\n', '\n     ').lstrip('\n    ')
                logger.info(f'Execute {rand_id}:{arg}\nSQL: {log_sql}')

                statement = await conn.prepare(sql)
                val = await statement.fetchval(*args) if only_one else await statement.fetch(*args)

                log_result = val if self._log_full_sql_result else '<see http response>'
                logger.info(f'Result {rand_id}:\n{log_result}\n')
                return val

    async def query_all_json(self, sql, *args):
        values = await self._query(False, sql, *args)
        rows = [json.loads(row[0]) for row in values]
        return rows

    async def query_one_json(self, sql, *args):
        value = await self._query(True, sql, *args)
        rows = json.loads(value) if value else {}
        return rows

    async def query_one(self, sql, *args):
        value = await self._query(True, sql, *args)
        return value

    async def execute(self, sql, *args):
        if app.pool:
            async with PoolProxy(app.pool).acquire() as conn:
                async with conn.transaction():
                    await self._setup_db_values(conn)
                    result = await conn.execute(sql, *args)
            return result

import json
import logging
from pkg.utils.auth_helper import AuthHelper
from pkg.utils.strgen import StringGenerator
from pkg.app import app


class Executor:
    _http_request = None

    def __init__(self, http_request):
        self._http_request = http_request

    async def _setup_db_values(self, conn):
        jwt = AuthHelper().get_jwt_from_request(self._http_request)
        user_id = jwt['id'] if jwt else 0
        statement = await conn.prepare(app.db_queries['set_user_id'])
        await statement.fetchval(user_id)

    async def _query(self, only_one, sql, *args):
        rand_id = StringGenerator(r'[\u\d]{8}').render()
        logger = logging.getLogger('postgres')
        logger.info('Execute %s (args: %s)\n%s' % (rand_id, [*args], sql))
        async with app.pool.acquire() as conn:
            await self._setup_db_values(conn)
            statement = await conn.prepare(sql)
            val = await statement.fetchval(*args) if only_one else await statement.fetch(*args)
        logger.info('Result %s\n%s\n' % (rand_id, val))
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
        async with app.pool.acquire() as conn:
            async with conn.transaction():
                await self._setup_db_values(conn)
                result = await conn.execute(sql, *args)
        return result

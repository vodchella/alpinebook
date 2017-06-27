import json
from pkg.utils.auth_helper import AuthHelper
from pkg.app import app


class Executor:
    _http_request = None

    def __init__(self, http_request):
        self._http_request = http_request

    async def _setup_db(self, conn):
        session_id = AuthHelper().get_session_id(self._http_request)
        user_id = await AuthHelper().get_user_id(session_id)
        statement = await conn.prepare(app.db_queries['set_user_id'])
        await statement.fetchval(user_id)

    async def _query(self, only_one, sql, *args):
        async with app.pool.acquire() as conn:
            await self._setup_db(conn)
            statement = await conn.prepare(sql)
            val = await statement.fetchval(*args) if only_one else await statement.fetch(*args)
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

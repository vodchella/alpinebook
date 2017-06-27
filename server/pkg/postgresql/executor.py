import json
from pkg.utils.singleton import singleton
from pkg.app import app


@singleton
class Executor:
    async def query_all_json(self, sql, *args):
        async with app.pool.acquire() as conn:
            statement = await conn.prepare(sql)
            values = await statement.fetch(*args)
            rows = [json.loads(row[0]) for row in values]
            return rows

    async def query_one_json(self, sql, *args):
        async with app.pool.acquire() as conn:
            statement = await conn.prepare(sql)
            value = await statement.fetchval(*args)
            rows = json.loads(value) if value else {}
            return rows

    async def query_one(self, sql, *args):
        async with app.pool.acquire() as conn:
            statement = await conn.prepare(sql)
            value = await statement.fetchval(*args)
            return value

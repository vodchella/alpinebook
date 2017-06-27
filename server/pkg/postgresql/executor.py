import json
from pkg.utils.singleton import singleton


@singleton
class Executor:
    async def query_all(self, statement, *args):
        values = await statement.fetch(*args)
        rows = [json.loads(row[0]) for row in values]
        return rows

    async def query_one(self, statement, *args):
        value = await statement.fetchval(*args)
        rows = json.loads(value) if value else {}
        return rows
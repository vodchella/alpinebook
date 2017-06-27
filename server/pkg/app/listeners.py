import asyncpg
import pkg.postgresql.queries
from . import app


@app.listener('before_server_start')
async def setup(app, loop):
    app.pool = await asyncpg.create_pool(dsn='postgres://postgres:postgres@localhost:5432/alpinebook_dev',
                                         min_size=1,
                                         max_size=10,
                                         max_inactive_connection_lifetime=0,
                                         command_timeout=60)
    async with app.pool.acquire() as conn:
        for query in filter(lambda q: 'SQL_' == q[:4], dir(pkg.postgresql.queries)):
            app.db_queries[query.lower()[4:]] = getattr(pkg.postgresql.queries, query)
        await conn.close()


@app.listener('after_server_stop')
async def close_pool(app, loop):
    await app.pool.close()

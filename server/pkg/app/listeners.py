import ssl
import logging
import asyncpg
import pkg.postgresql.queries
from pkg.constants import CONFIG
from pkg.utils.console import panic
from . import app


@app.listener('before_server_start')
async def setup(app, loop):
    def get_dsn(secure=False):
        return 'postgres://%s:%s@%s:%s/%s' % (CONFIG['postgres']['user'],
                                              '*****' if secure else CONFIG['postgres']['pass'],
                                              CONFIG['postgres']['host'],
                                              CONFIG['postgres']['port'],
                                              CONFIG['postgres']['db'])

    logger = logging.getLogger('postgres')
    logger.info('Connecting to %s' % get_dsn(secure=True))

    try:
        try:
            min_size = CONFIG['postgres']['pool']['min_size']
        except:
            min_size = 1
        try:
            max_size = CONFIG['postgres']['pool']['max_size']
        except:
            max_size = 10
        try:
            max_inactive_connection_lifetime = CONFIG['postgres']['pool']['max_inactive_connection_lifetime']
        except:
            max_inactive_connection_lifetime = 0
        try:
            command_timeout = CONFIG['postgres']['pool']['command_timeout']
        except:
            command_timeout = 60
        try:
            use_ssl = CONFIG['postgres']['ssl']
        except:
            use_ssl = False

        pool_info = 'pool.min_size: %s, pool.max_size: %s, pool.max_inactive_connection_lifetime: %s' % \
                    (min_size, max_size, max_inactive_connection_lifetime)
        logger.info('Connection settings: %s, command_timeout: %s, ssl: %s' %
                    (pool_info, command_timeout, use_ssl))

        if use_ssl:
            ctx = ssl.SSLContext(ssl.PROTOCOL_TLSv1_2)
            ctx.verify_mode = ssl.CERT_NONE
        else:
            ctx=False

        app.pool = await asyncpg.create_pool(dsn=get_dsn(),
                                             min_size=min_size,
                                             max_size=max_size,
                                             max_inactive_connection_lifetime=max_inactive_connection_lifetime,
                                             command_timeout=command_timeout,
                                             ssl=ctx)
    except Exception as e:
        logger.error(str(e))
        logging.getLogger('alpinebook').critical('Can\'t connect to PostgreSQL, goodbye honey!\n')
        panic()

    for query in filter(lambda q: 'SQL_' == q[:4], dir(pkg.postgresql.queries)):
        app.db_queries[query.lower()[4:]] = getattr(pkg.postgresql.queries, query)


@app.listener('after_server_stop')
async def close_pool(app, loop):
    await app.pool.close()
    logging.getLogger('alpinebook').info('Leaving, don\'t think badly...')

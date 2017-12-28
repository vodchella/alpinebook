import ssl
import logging
import asyncpg
import pkg.postgresql.queries
from aio_pika import connect
from aio_pika.patterns import RPC
from pkg.constants import CONFIG
from pkg.utils.console import panic
from pkg.rabbitmq import Rabbit
from . import app


@app.listener('after_server_start')
async def setup_rabbitmq(app, loop):
    def get_dsn(secure=False):
        user = CONFIG['rabbit']['user']
        pswd = '*****' if secure else CONFIG['rabbit']['pass']
        host = CONFIG['rabbit']['host']
        port = CONFIG['rabbit']['port']
        return f'amqp://{user}:{pswd}@{host}:{port}/'

    connection = None
    channel = None
    rpc = None
    logger = logging.getLogger('rabbitmq')
    try:
        logger.info(f'Connecting to {get_dsn(secure=True)}')
        connection = await connect(get_dsn(), loop=loop)
        channel = await connection.channel()
        rpc = await RPC.create(channel)
    except:
        logger.error('Can\'t connect to RabbitMQ. Report generaging isn\'t avaible')

    app.rabbitmq = Rabbit(connection, channel, rpc)


@app.listener('before_server_start')
async def setup_postgres(app, loop):
    def get_dsn(secure=False):
        user = CONFIG['postgres']['user']
        pswd = '*****' if secure else CONFIG['postgres']['pass']
        host = CONFIG['postgres']['host']
        port = CONFIG['postgres']['port']
        db = CONFIG['postgres']['db']
        return f'postgres://{user}:{pswd}@{host}:{port}/{db}'

    logger = logging.getLogger('postgres')
    logger.info(f'Connecting to {get_dsn(secure=True)}')

    try:
        try:
            min_s = CONFIG['postgres']['pool']['min_size']
        except:
            min_s = 1
        try:
            max_s = CONFIG['postgres']['pool']['max_size']
        except:
            max_s = 10
        try:
            micl = CONFIG['postgres']['pool']['max_inactive_connection_lifetime']
        except:
            micl = 0
        try:
            command_timeout = CONFIG['postgres']['pool']['command_timeout']
        except:
            command_timeout = 60
        try:
            use_ssl = CONFIG['postgres']['ssl']
        except:
            use_ssl = False

        pool_info = f'pool.min_size: {min_s}, pool.max_size: {max_s}, pool.max_inactive_connection_lifetime: {micl}'
        logger.info(f'Connection settings: {pool_info}, command_timeout: {command_timeout}, ssl: {use_ssl}')

        if use_ssl:
            ctx = ssl.SSLContext(ssl.PROTOCOL_TLSv1_2)
            ctx.verify_mode = ssl.CERT_NONE
        else:
            ctx = False

        app.pool = await asyncpg.create_pool(dsn=get_dsn(),
                                             min_size=min_s,
                                             max_size=max_s,
                                             max_inactive_connection_lifetime=micl,
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

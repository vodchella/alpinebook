import ssl
import logging
import asyncio
import asyncpg
import pkg.postgresql.queries
import motor.motor_asyncio
from aio_pika import connect
from aio_pika.patterns import RPC
from pkg.constants import CONFIG
from pkg.mongodb import Mongo
from pkg.postgresql.executor import PoolProxy
from pkg.utils.console import panic
from pkg.rabbitmq import Rabbit
from . import app


@app.listener('after_server_start')
async def start_informer(app, loop):
    logger = logging.getLogger('rest-http')
    logger.info(f'Server started at {app.host}:{app.port}')


@app.listener('after_server_start')
async def setup_mongodb(app, loop):
    def get_dsn():
        return f'mongodb://{CONFIG["mongo"]["host"]}:{CONFIG["mongo"]["port"]}'

    i, dsn = 0, get_dsn()
    max_attempts = CONFIG['mongo']['max-conn-attempts'] if 'max-conn-attempts' in CONFIG['mongo'] else 20
    conn_timeout_ms = CONFIG['mongo']['connect-timeout'] * 1000 if 'connect-timeout' in CONFIG['mongo'] else 1000
    logger = logging.getLogger('mongodb')

    logger.info(f'Connecting to {dsn}')
    while i < max_attempts:
        i += 1
        try:
            connection = motor.motor_asyncio.AsyncIOMotorClient(dsn, serverSelectionTimeoutMS=conn_timeout_ms, io_loop=loop)
            info = await connection.server_info()
            app.mongo = Mongo(connection)
            logger.info(f'Connection with MongoDB established: {info}')
            break
        except:
            if i >= max_attempts:
                logger.exception('Can\'t connect to MongoDB. Cache isn\'t avaible')
            else:
                logger.error(f'Can\'t connect to MongoDB, do another (#{i + 1}) attempt...')
                await asyncio.sleep(1)


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
    i, dsn = 0, get_dsn()
    max_attempts = CONFIG['rabbit']['max-conn-attempts'] if 'max-conn-attempts' in CONFIG['rabbit'] else 20

    logger.info(f'Connecting to {get_dsn(secure=True)}')
    while i < max_attempts:
        i += 1
        try:
            connection = await connect(dsn, loop=loop)
            channel = await connection.channel()
            rpc = await RPC.create(channel)
            logger.info('Connection with RabbitMQ established')
            break
        except:
            if i >= max_attempts:
                logger.exception('Can\'t connect to RabbitMQ. Report generating isn\'t avaible')
            else:
                logger.error(f'Can\'t connect to RabbitMQ, do another (#{i + 1}) attempt...')
                await asyncio.sleep(1)

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
        min_s = CONFIG['postgres']['pool']['min-size']
    except:
        min_s = 1
    try:
        max_s = CONFIG['postgres']['pool']['max-size']
    except:
        max_s = 10
    try:
        micl = CONFIG['postgres']['pool']['max-inactive-connection-lifetime']
    except:
        micl = 0
    try:
        command_timeout = CONFIG['postgres']['pool']['command-timeout']
    except:
        command_timeout = 60
    try:
        use_ssl = CONFIG['postgres']['ssl']
    except:
        use_ssl = False
    try:
        max_attempts = CONFIG['postgres']['max-conn-attempts']
    except:
        max_attempts = 120

    pool_info = f'pool.min-size: {min_s}, pool.max-size: {max_s}, pool.max-inactive-connection-lifetime: {micl}'
    logger.info(f'Connection settings: {pool_info}, command-timeout: {command_timeout}, ssl: {use_ssl}')

    if use_ssl:
        ctx = ssl.SSLContext(ssl.PROTOCOL_TLSv1_2)
        ctx.verify_mode = ssl.CERT_NONE
    else:
        ctx = False

    i, dsn = 0, get_dsn()
    while i < max_attempts:
        i += 1
        try:
            app.pool = await asyncpg.create_pool(dsn=dsn,
                                                 min_size=min_s,
                                                 max_size=max_s,
                                                 max_inactive_connection_lifetime=micl,
                                                 command_timeout=command_timeout,
                                                 ssl=ctx)
            app.pool_max_size = max_s
            async with PoolProxy(app.pool).acquire() as conn:
                info = conn.get_server_version()
            logger.info(f'Connection with PostgreSQL established: {info}')
            break
        except Exception as e:
            if i >= max_attempts:
                logger.exception(str(e))
                logging.getLogger('alpinebook').critical('Can\'t connect to PostgreSQL, goodbye honey!\n')
                panic()
            else:
                logger.error(f'Can\'t connect to PostgreSQL, do another (#{i + 1}) attempt...')
                await asyncio.sleep(1)

    for query in filter(lambda q: 'SQL_' == q[:4], dir(pkg.postgresql.queries)):
        app.db_queries[query.lower()[4:]] = getattr(pkg.postgresql.queries, query)


@app.listener('after_server_stop')
async def close_pool(app, loop):
    await app.pool.close()
    logging.getLogger('alpinebook').info('Leaving, don\'t think badly...')

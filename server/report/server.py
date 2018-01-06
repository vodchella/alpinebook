#!/usr/bin/env python3.6

import tempfile
import os
import sys
import asyncio
import uvloop
import pkg.constants
import logging
from logging import config
from aio_pika import connect
from aio_pika.patterns import RPC
from jinja2 import Environment, select_autoescape
from pid import PidFile
from pkg.reports import TemplateLoader, ReportLoader
from pkg.utils.decorators.handle_exceptions import handle_exceptions
from pkg.utils.settings import load_config
from pkg.utils.console import panic
from pkg.utils.errors import response_error, get_raised_error
from pkg.constants.error_codes import ERROR_REPORT_NOT_FOUND
from pkg.constants.file_names import PID_FILE_NAME


env = None


@handle_exceptions
async def generate_html(*, jwt, report_name, params):
    logger.info(f'RPC call of generate_html():\nREPORT_NAME:\t{report_name}\nPARAMS:\t{params}\n')
    if report_name in env.list_templates():
        template = env.get_template(report_name)
        report = ReportLoader(report_name, params, jwt)
        title = report.get_title()
        logger.info(f'Get data for \'{report_name}\' ({title})')
        data = await report.get_data()
        if 'error' in data:
            return response_error(data['error']['code'], data['error']['message'])
        rendered = await template.render_async(title=title, data=data)
        logger.info(f'Result of generate_html():\n{rendered}\n')
        return {'result': rendered, 'content-type': 'text/html'}
    else:
        return response_error(ERROR_REPORT_NOT_FOUND, f'Report \'{report_name}\' doesn\'t exists')


async def main(aio_loop):
    conf = pkg.constants.CONFIG

    def get_dsn(secure=False):
        user = conf['rabbit']['user']
        pswd = '*****' if secure else conf['rabbit']['pass']
        host = conf['rabbit']['host']
        port = conf['rabbit']['port']
        return f'amqp://{user}:{pswd}@{host}:{port}/'

    logger.info(f'Connecting to {get_dsn(secure=True)}')
    i, dsn = 0, get_dsn()
    max_attempts = conf['rabbit']['max_conn_attempts'] if 'max_conn_attempts' in conf['rabbit'] else 10
    while i < max_attempts:
        i += 1
        try:
            connection = await connect(dsn, loop=aio_loop)
            channel = await connection.channel()
            rpc = await RPC.create(channel)
            break
        except:
            if i >= max_attempts:
                logger.error(get_raised_error())
                logger.critical('Can\'t connect to RabbitMQ, goodbye honey!\n')
                panic()
            else:
                logger.error(f'Can\'t connect to RabbitMQ, do another (#{i + 1}) attempt...')
                await asyncio.sleep(1)

    await rpc.register('generate_html', generate_html)

    logger.info('Register RPC method: generate_html()')


if __name__ == '__main__':
    if sys.version_info < (3, 6):
        panic('We need mininum Python verion 3.6 to run. Current version: %s.%s.%s' % sys.version_info[:3])

    env_config_path = os.environ['ALPINEBOOK_REPORT_CONFIG_PATH'] \
        if 'ALPINEBOOK_REPORT_CONFIG_PATH' in os.environ else None
    config_path = env_config_path
    if not config_path:
        server_dir, _ = os.path.split(os.path.abspath(__file__))
        config_path = os.path.join(server_dir, 'config.py')

    try:
        cfg_module = load_config(config_path)
        pkg.constants.CONFIG = cfg_module.CONFIG
        pkg.constants.DEBUG = cfg_module.CONFIG['debug'] if 'debug' in cfg_module.CONFIG else False
        host = cfg_module.CONFIG['http']['host']
        port = cfg_module.CONFIG['http']['port']
        pkg.constants.HTTP_SERVER_URL = f'http://{host}:{port}'
    except:
        panic(f'Can\'t load config file {config_path}')

    from pkg.utils.logging import LOGGING
    from pkg.constants import APPLICATION_VERSION, DEBUG
    logging.config.dictConfig(LOGGING)

    config_name = f'"{pkg.constants.CONFIG["name"]}" ' if 'name' in pkg.constants.CONFIG else ''
    logger = logging.getLogger('report')
    logger.info(f'{APPLICATION_VERSION} started')
    logger.info(f'ALPINEBOOK_REPORT_CONFIG_PATH: {env_config_path}')
    logger.info(f'Configuration {config_name}loaded from {config_path}')
    logger.info(f'Debug mode {"on" if DEBUG else "off"}')

    pid_dir = tempfile.gettempdir()
    try:
        with PidFile(PID_FILE_NAME, piddir=pid_dir) as p:
            logger.info(f'PID: {p.pid}  FILE: {pid_dir}/{PID_FILE_NAME}.pid')
            env = Environment(
                loader=TemplateLoader(),
                autoescape=select_autoescape(['html', 'xml']),
                auto_reload=True,
                enable_async=True
            )
            asyncio.set_event_loop_policy(uvloop.EventLoopPolicy())
            loop = asyncio.get_event_loop()
            loop.create_task(main(loop))
            loop.run_forever()
    except:
        logger.critical(f'Something wrong with {pid_dir}/{PID_FILE_NAME}.pid. Maybe it\'s locked?')

import tempfile
import os
import sys
import asyncio
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
    logger.info('RPC call of generate_html():\nREPORT_NAME:\t%s\nPARAMS:\t%s\n' % (report_name, params))
    if report_name in env.list_templates():
        template = env.get_template(report_name)
        report = ReportLoader(report_name, params, jwt)
        title = report.get_title()
        logger.info('Get data for \'%s\' (%s)' % (report_name, title))
        data = await report.get_data()
        if 'error' in data:
            return response_error(data['error']['code'], data['error']['message'])
        rendered = await template.render_async(title=title, data=data)
        logger.info('Result of generate_html():\n%s\n' % rendered)
        return {'result': rendered, 'content-type': 'text/html'}
    else:
        return response_error(ERROR_REPORT_NOT_FOUND, 'Report \'%s\' doesn\'t exists' % report_name)


async def main(aio_loop):
    conf = pkg.constants.CONFIG

    def get_dsn(secure=False):
        return 'amqp://%s:%s@%s:%s/' % (conf['rabbit']['user'],
                                        '*****' if secure else conf['rabbit']['pass'],
                                        conf['rabbit']['host'],
                                        conf['rabbit']['port'])

    try:
        connection = await connect(get_dsn(), loop=aio_loop)
        channel = await connection.channel()
        rpc = await RPC.create(channel)
    except:
        logger.error(get_raised_error())
        logger.critical('Can\'t connect to RabbitMQ, goodbye honey!\n')
        panic()

    await rpc.register('generate_html', generate_html)

    logger.info('Register RPC method: generate_html()')


if __name__ == '__main__':
    if sys.version_info < (3, 6):
        panic('We need mininum Python verion 3.6 to run. Current version: %s.%s.%s' % sys.version_info[:3])

    # TODO: Дублирующийся с http-сервером код вынести в общий каталог
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
        pkg.constants.HTTP_SERVER_URL = 'http://%s:%s' % (cfg_module.CONFIG['http']['listen-host'],
                                                          cfg_module.CONFIG['http']['listen-port'])
    except:
        panic('Can\'t load config file %s' % config_path)

    from pkg.utils.logging import LOGGING
    from pkg.constants import APPLICATION_VERSION, DEBUG
    logging.config.dictConfig(LOGGING)

    config_name = ('"%s" ' % pkg.constants.CONFIG['name']) if 'name' in pkg.constants.CONFIG else ''
    logger = logging.getLogger('report')
    logger.info(APPLICATION_VERSION + ' started')
    logger.info('ALPINEBOOK_REPORT_CONFIG_PATH: %s' % env_config_path)
    logger.info('Configuration %sloaded from %s', config_name, config_path)
    logger.info('Debug mode %s' % ('on' if DEBUG else 'off'))

    with PidFile(PID_FILE_NAME, piddir=tempfile.gettempdir()) as p:
        env = Environment(
            loader=TemplateLoader(),
            autoescape=select_autoescape(['html', 'xml']),
            auto_reload=True,
            enable_async=True
        )
        loop = asyncio.get_event_loop()
        loop.create_task(main(loop))
        loop.run_forever()

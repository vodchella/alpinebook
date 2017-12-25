import tempfile
import os
import asyncio
import pkg.constants
from aio_pika import connect
from aio_pika.patterns import RPC
from jinja2 import Environment, select_autoescape
from pid import PidFile
from pkg.reports import TemplateLoader, ReportLoader
from pkg.utils.decorators.handle_exceptions import handle_exceptions
from pkg.utils.settings import load_config
from pkg.utils.console import panic
from pkg.utils.errors import response_error
from pkg.constants.error_codes import ERROR_REPORT_NOT_FOUND
from pkg.constants.file_names import PID_FILE_NAME


env = None


@handle_exceptions
async def generate_html(*, jwt, report_name, params):
    if report_name in env.list_templates():
        template = env.get_template(report_name)
        report = ReportLoader(report_name, params, jwt)
        data = await report.get_data()
        if 'error' in data:
            return data
        rendered = template.render(title=report.get_title(), data=data)
        return {'result': rendered, 'content-type': 'text/html'}
    else:
        return response_error(ERROR_REPORT_NOT_FOUND, 'Report doesn\'t exists')


async def main(loop):
    conf = pkg.constants.CONFIG

    def get_dsn(secure=False):
        return 'amqp://%s:%s@%s:%s/' % (conf['rabbit']['user'],
                                        '*****' if secure else conf['rabbit']['pass'],
                                        conf['rabbit']['host'],
                                        conf['rabbit']['port'])
    connection = await connect(get_dsn(), loop=loop)
    channel = await connection.channel()
    rpc = await RPC.create(channel)
    await rpc.register('generate_html', generate_html)


if __name__ == '__main__':
    # TODO: Реализовать логирование
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

    with PidFile(PID_FILE_NAME, piddir=tempfile.gettempdir()) as p:
        env = Environment(
            loader=TemplateLoader(),
            autoescape=select_autoescape(['html', 'xml'])
        )
        loop = asyncio.get_event_loop()
        loop.create_task(main(loop))
        print(" [x] Awaiting RPC requests")
        loop.run_forever()

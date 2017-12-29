#!venv-http/bin/python3.6

import asyncio
import uvloop
import logging
import importlib
import tempfile
import os
import sys
import pkg.constants
from glob import glob
from pid import PidFile
from pkg.utils.settings import load_config
from pkg.utils.console import panic


if __name__ == '__main__':
    if sys.version_info < (3, 6):
        panic('We need mininum Python verion 3.6 to run. Current version: %s.%s.%s' % sys.version_info[:3])

    env_config_path = os.environ['ALPINEBOOK_HTTP_CONFIG_PATH'] if 'ALPINEBOOK_HTTP_CONFIG_PATH' in os.environ else None
    config_path = env_config_path
    if not config_path:
        server_dir, _ = os.path.split(os.path.abspath(__file__))
        config_path = os.path.join(server_dir, 'config.py')

    try:
        cfg_module = load_config(config_path)
        pkg.constants.CONFIG = cfg_module.CONFIG
        pkg.constants.DEBUG = cfg_module.CONFIG['debug'] if 'debug' in cfg_module.CONFIG else False
    except:
        panic(f'Can\'t load config file {config_path}')

    asyncio.set_event_loop_policy(uvloop.EventLoopPolicy())

    from pkg.app import app, v1
    from pkg.constants import APPLICATION_VERSION, DEBUG
    from pkg.constants.file_names import PID_FILE_NAME

    config_name = f'"{pkg.constants.CONFIG["name"]}" ' if 'name' in pkg.constants.CONFIG else ''
    logger = logging.getLogger('alpinebook')
    logger.info(f'{APPLICATION_VERSION} started')
    logger.info(f'ALPINEBOOK_HTTP_CONFIG_PATH: {env_config_path}')
    logger.info(f'Configuration {config_name}loaded from {config_path}')
    logger.info(f'Debug mode {"on" if DEBUG else "off"}')

    host = pkg.constants.CONFIG['http']['listen-host']
    port = pkg.constants.CONFIG['http']['listen-port']

    pid_file = PID_FILE_NAME % port
    pid_dir = tempfile.gettempdir()
    with PidFile(pid_file, piddir=pid_dir) as p:
        logger.info(f'PID: {p.pid}  FILE: {pid_dir}/{pid_file}.pid')
        for md in [os.path.basename(x)[:-3] for x in glob('./pkg/app/*.py') if x[-11:] != '__init__.py']:
            importlib.import_module(f'pkg.app.{md}')
        app.blueprint(v1)
        app.run(host=host, port=port, access_log=False)

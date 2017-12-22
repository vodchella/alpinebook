import logging
import importlib
import tempfile
import os
import pkg.constants
from glob import glob
from pid import PidFile
from pkg.utils.settings import load_config
from pkg.utils.console import panic


if __name__ == '__main__':
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
        panic('Can\'t load config file %s' % config_path)

    from pkg.app import app
    from pkg.constants import APPLICATION_VERSION, DEBUG
    from pkg.constants.file_names import PID_FILE_NAME

    config_name = ('"%s" ' % pkg.constants.CONFIG['name']) if 'name' in pkg.constants.CONFIG else ''
    logger = logging.getLogger('alpinebook')
    logger.info(APPLICATION_VERSION + ' started')
    logger.info('ALPINEBOOK_HTTP_CONFIG_PATH: %s' % env_config_path)
    logger.info('Configuration %sloaded from %s', config_name, config_path)
    logger.info('Debug mode %s' % ('on' if DEBUG else 'off'))

    host = pkg.constants.CONFIG['http']['listen-host']
    port = pkg.constants.CONFIG['http']['listen-port']

    with PidFile(PID_FILE_NAME % port, piddir=tempfile.gettempdir()) as p:
        logger.info('PID: %s' % p.pid)
        for md in [os.path.basename(x)[:-3] for x in glob('./pkg/app/*.py') if x[-11:] != '__init__.py']:
            importlib.import_module('pkg.app.' + md)
        app.run(host=host, port=port)

import logging
import importlib
from os import path
from glob import glob
from pkg.app import app
from pkg.constants import APPLICATION_VERSION


if __name__ == '__main__':
    logging.getLogger('alpinebook').info(APPLICATION_VERSION + ' started!')
    for md in [path.basename(x)[:-3] for x in glob('./pkg/app/*.py') if x[-11:] != '__init__.py']:
        importlib.import_module('pkg.app.' + md)
    app.run(host='localhost', port=8000)

import sys
import importlib
from os import path
from glob import glob
from pkg.app import app
from pkg.constants.date_formats import DATE_FORMAT_FULL
from sanic.config import LOGGING

if __name__ == '__main__':
    LOGGING['formatters']['simple']['format'] = '%(levelname)s\t%(asctime)s\t%(name)s: %(message)s'
    LOGGING['formatters']['access']['format'] = '%(levelname)s\t%(asctime)s\t%(name)s [%(host)s]: %(request)s %(message)s %(status)d %(byte)d'
    LOGGING['formatters']['simple']['datefmt'] = DATE_FORMAT_FULL
    LOGGING['formatters']['access']['datefmt'] = DATE_FORMAT_FULL

    LOGGING['handlers'] = {
        'internal': {
            'class': 'logging.StreamHandler',
            'filters': ['accessFilter'],
            'formatter': 'simple',
            'stream': sys.stderr
        },
        'accessStream': {
            'class': 'logging.StreamHandler',
            'filters': ['accessFilter'],
            'formatter': 'access',
            'stream': sys.stderr
        },
        'postgresStream': {
            'class': 'logging.StreamHandler',
            'filters': ['accessFilter'],
            'formatter': 'simple',
            'stream': sys.stderr
        },
        'alpinebookTimedRotatingFile': {
            'class': 'logging.handlers.TimedRotatingFileHandler',
            'formatter': 'simple',
            'when': 'midnight',
            'filename': 'alpinebook.log'
        },
        'alpinebookAccessTimedRotatingFile': {
            'class': 'logging.handlers.TimedRotatingFileHandler',
            'formatter': 'access',
            'when': 'midnight',
            'filename': 'alpinebook.log'
        }
    }

    LOGGING['loggers']['sanic']['handlers'] = ['internal', 'alpinebookTimedRotatingFile']
    LOGGING['loggers']['network']['handlers'] = ['accessStream', 'alpinebookAccessTimedRotatingFile']
    LOGGING['loggers']['postgres'] = {
        'level': 'DEBUG',
        'handlers': ['internal', 'alpinebookTimedRotatingFile']
    }

    for md in [path.basename(x)[:-3] for x in glob('./pkg/app/*.py') if x[-11:] != '__init__.py']:
        importlib.import_module('pkg.app.' + md)
    app.run(host='localhost', port=8000, log_config=LOGGING)

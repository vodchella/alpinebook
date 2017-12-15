import sys
from pkg.constants.date_formats import DATE_FORMAT_FULL
from pkg.constants.file_names import LOG_FILE_NAME
from sanic.config import LOGGING


def setup_logging():
    LOGGING['formatters']['simple']['format'] = '%(levelname)s\t%(asctime)s\t%(name)s: %(message)s'
    LOGGING['formatters']['access'][
        'format'] = '%(levelname)s\t%(asctime)s\t%(name)s [%(host)s]: %(request)s %(message)s %(status)d %(byte)d'
    LOGGING['formatters']['simple']['datefmt'] = DATE_FORMAT_FULL
    LOGGING['formatters']['access']['datefmt'] = DATE_FORMAT_FULL

    LOGGING['handlers']['accessTimedRotatingFile']['filename'] = LOG_FILE_NAME
    LOGGING['handlers']['errorTimedRotatingFile']['filename'] = LOG_FILE_NAME
    LOGGING['handlers']['internal'] = {
        'class': 'logging.StreamHandler',
        'formatter': 'simple',
        'stream': sys.stderr
    }
    LOGGING['handlers']['alpinebookTimedRotatingFile'] = {
        'class': 'logging.handlers.TimedRotatingFileHandler',
        'formatter': 'simple',
        'when': 'midnight',
        'filename': LOG_FILE_NAME
    }
    LOGGING['handlers']['alpinebookAccessTimedRotatingFile'] = {
        'class': 'logging.handlers.TimedRotatingFileHandler',
        'formatter': 'access',
        'when': 'midnight',
        'filename': LOG_FILE_NAME
    }

    LOGGING['loggers']['sanic']['handlers'] += ['alpinebookTimedRotatingFile']
    LOGGING['loggers']['network']['handlers'] += ['alpinebookAccessTimedRotatingFile']
    LOGGING['loggers']['rest-http'] = {
        'level': 'DEBUG',
        'handlers': ['internal', 'alpinebookTimedRotatingFile']
    }
    LOGGING['loggers']['postgres'] = {
        'level': 'DEBUG',
        'handlers': ['internal', 'alpinebookTimedRotatingFile']
    }
    LOGGING['loggers']['alpinebook'] = {
        'level': 'DEBUG',
        'handlers': ['internal', 'alpinebookTimedRotatingFile']
    }

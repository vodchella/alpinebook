import sys
from pkg.constants import CONFIG
from pkg.constants.date_formats import DATE_FORMAT_FULL
from sanic.config import LOGGING


def setup_logging():
    try:
        disabled = CONFIG['logging']['disabled']
    except:
        disabled = False
    log_file_name = None
    try:
        log_file_name = '/dev/null' if disabled else CONFIG['logging']['file-name']
    except:
        disabled = True

    LOGGING['formatters']['simple']['format'] = '%(levelname)s\t%(asctime)s\t%(name)s: %(message)s'
    LOGGING['formatters']['access'][
        'format'] = '%(levelname)s\t%(asctime)s\t%(name)s [%(host)s]: %(request)s %(message)s %(status)d %(byte)d'
    LOGGING['formatters']['simple']['datefmt'] = DATE_FORMAT_FULL
    LOGGING['formatters']['access']['datefmt'] = DATE_FORMAT_FULL

    LOGGING['handlers']['accessTimedRotatingFile']['filename'] = log_file_name
    LOGGING['handlers']['errorTimedRotatingFile']['filename'] = log_file_name
    LOGGING['handlers']['internal'] = {
        'class': 'logging.StreamHandler',
        'formatter': 'simple',
        'stream': sys.stderr
    }
    LOGGING['handlers']['alpinebookTimedRotatingFile'] = {
        'class': 'logging.handlers.TimedRotatingFileHandler',
        'formatter': 'simple',
        'when': 'midnight',
        'filename': log_file_name
    }
    LOGGING['handlers']['alpinebookAccessTimedRotatingFile'] = {
        'class': 'logging.handlers.TimedRotatingFileHandler',
        'formatter': 'access',
        'when': 'midnight',
        'filename': log_file_name
    }

    if disabled:
        alpinebook_handlers = ['internal']
    else:
        alpinebook_handlers = ['internal', 'alpinebookTimedRotatingFile']
        LOGGING['loggers']['sanic']['handlers'] += ['alpinebookTimedRotatingFile']
        LOGGING['loggers']['network']['handlers'] += ['alpinebookAccessTimedRotatingFile']

    LOGGING['loggers']['rest-http'] = {
        'level': 'DEBUG',
        'handlers': alpinebook_handlers
    }
    LOGGING['loggers']['postgres'] = {
        'level': 'DEBUG',
        'handlers': alpinebook_handlers
    }
    LOGGING['loggers']['alpinebook'] = {
        'level': 'DEBUG',
        'handlers': alpinebook_handlers
    }
    LOGGING['loggers']['rabbitmq'] = {
        'level': 'DEBUG',
        'handlers': alpinebook_handlers
    }

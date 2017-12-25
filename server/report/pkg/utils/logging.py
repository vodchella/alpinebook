import sys
from pkg.constants import CONFIG
from pkg.constants.date_formats import DATE_FORMAT_FULL


try:
    disabled = CONFIG['logging']['disabled']
except:
    disabled = False
log_file_name = None
try:
    log_file_name = '/dev/null' if disabled else CONFIG['logging']['file-name']
except:
    disabled = True

if disabled:
    alpinebook_handlers = ['internal']
else:
    alpinebook_handlers = ['internal', 'alpinebookTimedRotatingFile']


LOGGING = {
    'version': 1,
    'formatters': {
        'simple': {
            'format': '%(levelname)s\t%(asctime)s\t%(name)s: %(message)s',
            'datefmt': DATE_FORMAT_FULL
        }
    },
    'handlers': {
        'internal': {
            'class': 'logging.StreamHandler',
            'formatter': 'simple',
            'stream': sys.stderr
        },
        'alpinebookTimedRotatingFile': {
            'class': 'logging.handlers.TimedRotatingFileHandler',
            'formatter': 'simple',
            'when': 'midnight',
            'filename': log_file_name
        }
    },
    'loggers': {
        'report': {
            'level': 'DEBUG',
            'handlers': alpinebook_handlers
        }
    }
}

import sys
import traceback
import logging
from sanic import response


def get_raised_error(full=False):
    info = sys.exc_info()
    if info[0] is None and info[1] is None and info[2] is None:
        return
    e = traceback.format_exception(*info)
    if full:
        return '\n'.join(e)
    else:
        return (e[-1:][0]).strip('\n')


def response_error(code, message, status=500, default_logger='alpinebook', log_stacktrace=True):
    error_json = {'error': {'code': code, 'message': message}}
    stacktrace_log_msg = ''
    if log_stacktrace:
        error_stacktrace = get_raised_error(True)
        stacktrace_log_msg = f'\n{error_stacktrace}\n' if error_stacktrace else ''

    logger = logging.getLogger(default_logger)
    logger.error(f'Status: {status}, JSON: {error_json}{stacktrace_log_msg}')

    return response.json(error_json, status=status)

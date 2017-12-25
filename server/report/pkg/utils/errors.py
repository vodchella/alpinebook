import sys
import traceback
import logging


def get_raised_error(full=False):
    info = sys.exc_info()
    if info[0] is None and info[1] is None and info[2] is None:
        return
    e = traceback.format_exception(*info)
    if full:
        return '\n'.join(e)
    else:
        return (e[-1:][0]).strip('\n')


def response_error(code, message, default_logger='report', log_stacktrace=True):
    error_json = {'error': {'code': code, 'message': message}}
    stacktrace_log_msg = ''
    if log_stacktrace:
        error_stacktrace = get_raised_error(True)
        stacktrace_log_msg = '\n%s\n' % error_stacktrace if error_stacktrace else ''

    logger = logging.getLogger(default_logger)
    logger.error('JSON: %s%s' % (error_json, stacktrace_log_msg))

    return error_json

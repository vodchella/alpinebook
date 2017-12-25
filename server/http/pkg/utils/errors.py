import sys
import traceback
import logging
from sanic import response


ERROR_INTERNAL_EXCEPTION = -32001
ERROR_SCHEMA_VALIDATION = -32002
ERROR_DATABASE_EXCEPTION = -32003
ERROR_UNIQUE_VIOLATION = -32004
ERROR_NO_AUTH_METHOD_SPECIFIED = -32005
ERROR_INVALID_AUTH_METHOD_SPECIFIED = -32006
ERROR_IP_ADDRESS_NOT_ALLOWED = -32007
ERROR_INVALID_IDENTIFIER = -32008
ERROR_INVALID_CREDENTIALS = -32009
ERROR_USER_NOT_ACTIVE = -32010
ERROR_JWT_INVALID_TOKEN = -32011
ERROR_JWT_INVALID_KEY = -32012
ERROR_RABBITMQ_NOT_AVAIBLE = -32013
ERROR_RABBITMQ_EXCEPTION = -32014
ERROR_RABBITMQ_UNKNOWN_ANSWER_FORMAT = -32015


def get_raised_error(full=False):
    info = sys.exc_info()
    if info[0] is None and info[1] is None and info[2] is None:
        return
    e = traceback.format_exception(*info)
    if full:
        return '\n'.join(e)
    else:
        return (e[-1:][0]).strip('\n')


def response_error(code, message, status=200, default_logger='alpinebook', log_stacktrace=True):
    error_json = {'error': {'code': code, 'message': message}}
    stacktrace_log_msg = ''
    if log_stacktrace:
        error_stacktrace = get_raised_error(True)
        stacktrace_log_msg = '\n%s\n' % error_stacktrace if error_stacktrace else ''

    logger = logging.getLogger(default_logger)
    logger.error('Status: %s, JSON: %s%s' % (status, error_json, stacktrace_log_msg))

    return response.json(error_json, status=status)

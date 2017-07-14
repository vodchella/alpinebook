import sys
import traceback
from sanic import response


ERROR_INTERNAL_EXCEPTION = -32001
ERROR_SCHEMA_VALIDATION = -32002
ERROR_DATABASE_EXCEPTION = -32003
ERROR_UNIQUE_VIOLATION = -32004


def get_raised_error(full=False):
    e = traceback.format_exception(*sys.exc_info())
    if full:
        return '\n'.join(e)
    else:
        return e[-1:][0]


def response_error(code, message, status=200):
    return response.json({'error': {'code': code, 'message': message}}, status=status)

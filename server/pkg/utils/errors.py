import sys
import traceback
from sanic import response


ERROR_SCHEMA_VALIDATION = -32001


def get_raised_error(full=False):
    e = traceback.format_exception(*sys.exc_info())
    if full:
        return '\n'.join(e)
    else:
        return e[-1:][0]


def response_error(code, message):
    return response.json({'error': {'code': code, 'message': message}})

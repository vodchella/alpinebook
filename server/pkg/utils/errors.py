import sys
import traceback
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


def get_raised_error(full=False):
    e = traceback.format_exception(*sys.exc_info())
    if full:
        return '\n'.join(e)
    else:
        return e[-1:][0]


def response_error(code, message, status=200):
    return response.json({'error': {'code': code, 'message': message}}, status=status)

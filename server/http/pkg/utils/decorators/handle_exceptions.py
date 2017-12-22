from pkg.utils.errors import response_error, get_raised_error
from pkg.utils.errors import (
    ERROR_INTERNAL_EXCEPTION, ERROR_DATABASE_EXCEPTION,
    ERROR_JWT_INVALID_TOKEN, ERROR_JWT_INVALID_KEY
)
from asyncpg.exceptions._base import PostgresError
from jwt.exceptions import InvalidTokenError, InvalidKeyError


def handle_exceptions(func):
    async def wrapped(*positional, **named):
        try:
            return await func(*positional, **named)
        except PostgresError as e:
            return response_error(ERROR_DATABASE_EXCEPTION, str(e), default_logger='postgres')
        except InvalidTokenError:
            return response_error(ERROR_JWT_INVALID_TOKEN, get_raised_error())
        except InvalidKeyError:
            return response_error(ERROR_JWT_INVALID_KEY, get_raised_error())
        except:
            return response_error(ERROR_INTERNAL_EXCEPTION, get_raised_error())
    return wrapped

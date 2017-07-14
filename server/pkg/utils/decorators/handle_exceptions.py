from pkg.utils.errors import response_error, get_raised_error
from pkg.utils.errors import ERROR_INTERNAL_EXCEPTION, ERROR_DATABASE_EXCEPTION
from asyncpg.exceptions._base import PostgresError


def handle_exceptions(func):
    async def wrapped(*positional, **named):
        try:
            return await func(*positional, **named)
        except PostgresError as e:
            return response_error(ERROR_DATABASE_EXCEPTION, str(e))
        except:
            return response_error(ERROR_INTERNAL_EXCEPTION, get_raised_error())
    return wrapped

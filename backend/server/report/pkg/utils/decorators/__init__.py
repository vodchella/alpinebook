import logging
from pkg.utils.errors import response_error, get_raised_error
from pkg.constants.error_codes import ERROR_INTERNAL_EXCEPTION, ERROR_RABBITMQ_EXCEPTION
from pika.exceptions import AMQPError
from functools import wraps


def handle_exceptions(func):
    @wraps(func)
    async def wrapped(*positional, **named):
        try:
            return await func(*positional, **named)
        except AMQPError:
            return response_error(ERROR_RABBITMQ_EXCEPTION, get_raised_error(), default_logger='rabbitmq')
        except:
            return response_error(ERROR_INTERNAL_EXCEPTION, get_raised_error())

    return wrapped


def rpc_handler(func):
    @wraps(func)
    async def wrapped(*positional, **named):
        s = '\n'
        logger = logging.getLogger('report')
        for name, val in named.items():
            if name != 'jwt':
                s += f'{name.upper()}: {val}\n'
        logger.info(f'Call RPC method {func.__name__.upper()}:{s}')
        return await func(*positional, **named)

    wrapped.rpc_handler = True
    return wrapped

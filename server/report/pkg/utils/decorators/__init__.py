import logging
from pkg.utils.errors import response_error, get_raised_error
from pkg.constants.error_codes import ERROR_INTERNAL_EXCEPTION, ERROR_RABBITMQ_EXCEPTION
from pika.exceptions import AMQPError


def handle_exceptions(func):
    fn_name = func.orig_func_name if 'orig_func_name' in func.__dict__.keys() else func.__name__

    async def wrapped(*positional, **named):
        try:
            return await func(*positional, **named)
        except AMQPError:
            return response_error(ERROR_RABBITMQ_EXCEPTION, get_raised_error(), default_logger='rabbitmq')
        except:
            return response_error(ERROR_INTERNAL_EXCEPTION, get_raised_error())

    wrapped.orig_func_name = fn_name
    return wrapped


def rpc_handler(func):
    fn_name = func.orig_func_name if 'orig_func_name' in func.__dict__.keys() else func.__name__

    async def wrapped(*positional, **named):
        s = '\n'
        logger = logging.getLogger('report')
        for name, val in named.items():
            if name != 'jwt':
                s += f'{name.upper()}: {val}\n'
        logger.info(f'Call RPC method {fn_name.upper()}:{s}')
        return await func(*positional, **named)

    wrapped.rpc_handler = True
    wrapped.orig_func_name = fn_name
    return wrapped

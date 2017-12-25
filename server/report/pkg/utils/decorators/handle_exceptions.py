from pkg.utils.errors import response_error, get_raised_error
from pkg.constants.error_codes import ERROR_INTERNAL_EXCEPTION, ERROR_RABBITMQ_EXCEPTION
from pika.exceptions import AMQPError


def handle_exceptions(func):
    async def wrapped(*positional, **named):
        try:
            return await func(*positional, **named)
        except AMQPError:
            return response_error(ERROR_RABBITMQ_EXCEPTION, get_raised_error(), default_logger='rabbitmq')
        except:
            return response_error(ERROR_INTERNAL_EXCEPTION, get_raised_error())
    return wrapped

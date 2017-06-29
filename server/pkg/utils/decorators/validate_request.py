from pkg.utils.json.validator import Validator


def validate_request(schema_name):
    def decorator(func):
        async def wrapped(*positional, **named):
            request = positional[0]
            invalid = Validator().validate(request.json, schema_name)
            return invalid if invalid else await func(*positional, **named)
        return wrapped
    return decorator

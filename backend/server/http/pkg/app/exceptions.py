from sanic.exceptions import NotFound, InvalidUsage, ServerError, URLBuildError
from sanic.exceptions import FileNotFound, RequestTimeout, PayloadTooLarge, HeaderNotFound
from pkg.utils.errors import response_error
from . import app


@app.exception(InvalidUsage)
@app.exception(NotFound)
@app.exception(ServerError)
@app.exception(URLBuildError)
@app.exception(FileNotFound)
@app.exception(RequestTimeout)
@app.exception(PayloadTooLarge)
@app.exception(HeaderNotFound)
def error_handler(request, exception):
    return response_error(exception.status_code, str(exception), exception.status_code)

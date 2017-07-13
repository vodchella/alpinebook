from sanic.exceptions import NotFound
from pkg.utils.errors import response_error
from . import app


@app.exception(NotFound)
def handler_404(request, exception):
    return response_error(404, str(exception), 404)

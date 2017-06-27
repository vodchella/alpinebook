from sanic.exceptions import NotFound
from sanic import response
from . import app


@app.exception(NotFound)
def handler_404(request, exception):
    return response.html('This is <b>404</b>')

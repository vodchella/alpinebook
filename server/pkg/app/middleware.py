from . import app
from pkg.constants import APPLICATION_VERSION


@app.middleware('response')
async def custom_headers(request, resp):
    resp.headers['Server'] = APPLICATION_VERSION

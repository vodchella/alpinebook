from . import app


@app.middleware('response')
async def custom_headers(request, resp):
    resp.headers['Server'] = 'AlpineBook v0.01'

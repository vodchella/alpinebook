import logging
import json
from . import app
from pkg.constants import APPLICATION_VERSION


@app.middleware('response')
async def custom_headers(request, resp):
    resp.headers['Server'] = APPLICATION_VERSION


@app.middleware('request')
async def log_response(request):
    try:
        body = '\nBODY: ' + request.body.decode('utf-8') if request.body else ''
    except:
        body = '\nBODY: <binary data>'
    user_agent = request.headers['user-agent'] if 'user-agent' in request.headers else ''
    auth = '\nAUTH: ' + request.headers['authorization'] if 'authorization' in request.headers else ''
    args = '\nARGS: ' + str(request.raw_args) if request.raw_args else ''
    log_body = '%s%s%s' % (auth, args, body)
    log_body = log_body + '\n' if log_body else ''
    logger = logging.getLogger('rest-http')
    logger.info('REQUEST %s %s from %s %s%s' %
                (request.method, request.path, request.ip[0], user_agent, log_body))


@app.middleware('response')
async def log_response(request, response):
    logger = logging.getLogger('rest-http')
    body = '\nBODY: ' +\
           json.dumps(json.loads(response.body.decode('utf-8')), ensure_ascii=False) if response.body else ''
    logger.info('RESPONSE %s:%s\n' % (response.content_type, body))

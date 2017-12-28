import logging
import json
from . import app
from pkg.constants import APPLICATION_VERSION


@app.middleware('response')
async def custom_headers(request, resp):
    resp.headers['Server'] = APPLICATION_VERSION


@app.middleware('request')
async def log_request(request):
    try:
        body = '\nBODY: ' + request.body.decode('utf-8') if request.body else ''
    except:
        body = '\nBODY: <binary data>'
    user_agent = request.headers['user-agent'] if 'user-agent' in request.headers else ''
    auth = f'\nAUTH: {request.headers["authorization"]}' if 'authorization' in request.headers else ''
    args = f'\nARGS: {str(request.raw_args)}' if request.raw_args else ''
    log_body = f'{auth}{args}{body}'
    log_body = f'{log_body}\n' if log_body else ''
    logger = logging.getLogger('rest-http')
    logger.info(f'REQUEST {request.method} {request.path} from {request.ip} {user_agent}{log_body}')


@app.middleware('response')
async def log_response(request, response):
    logger = logging.getLogger('rest-http')
    try:
        body = json.dumps(json.loads(response.body.decode('utf-8')), ensure_ascii=False) if response.body else ''
    except:
        body = response.body.decode('utf-8') if response.body else ''
    body = f'\nBODY: {body}'
    logger.info(f'RESPONSE {response.content_type}:{body}\n')

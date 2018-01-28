import logging
from base64 import b64decode
from sanic import response
from sanic.response import HTTPResponse

from pkg.utils.errors import response_error
from pkg.utils.decorators.handle_exceptions import handle_exceptions
from pkg.constants.error_codes import ERROR_RABBITMQ_NOT_AVAIBLE, ERROR_RABBITMQ_UNKNOWN_ANSWER_FORMAT


class Rabbit:
    _connection = None
    _channel = None
    _rpc = None

    def __init__(self, connection, channel, rpc):
        self._connection = connection
        self._channel = channel
        self._rpc = rpc

    @handle_exceptions
    async def rpc_call(self, method, args):
        if self._rpc:
            # TODO: добавить уникальный ID запроса
            logger = logging.getLogger('rabbitmq')
            a = {e: args[e] for e in args if e != 'jwt'}
            logger.info(f'Send RPC request:\nMETHOD:\t{method}\nARGS:\t{a}\n')
            return await self._rpc.call(method, kwargs=args)
        else:
            return response_error(ERROR_RABBITMQ_NOT_AVAIBLE, 'Генерация отчётов недоступна', default_logger='rabbitmq')

    @staticmethod
    def process_rpc_result(rpc_result):
        resp = None
        send_resp_unknown = False

        if type(rpc_result) == dict:
            content_type = rpc_result['content-type'] if 'content-type' in rpc_result else 'text/plain'
            body = rpc_result['result'] if 'result' in rpc_result else ''
            error = rpc_result['error'] if 'error' in rpc_result else None
            if error:
                resp = response_error(error['code'], error['message'], default_logger='rabbitmq')
            else:
                if content_type == 'text/html':
                    resp = response.html(body)
                elif content_type == 'text/plain':
                    resp = response.text(body)
                elif content_type == 'application/json':
                    resp = response.json(body)
                elif content_type == 'application/pdf_base64':
                    raw_pdf = None
                    try:
                        raw_pdf = b64decode(body, validate=True)
                    except:
                        pass
                    resp = HTTPResponse(content_type='application/pdf', body_bytes=raw_pdf)
                else:
                    send_resp_unknown = True
        elif type(rpc_result) == HTTPResponse:
            resp = rpc_result
        else:
            send_resp_unknown = True

        if send_resp_unknown:
            return response_error(ERROR_RABBITMQ_UNKNOWN_ANSWER_FORMAT,
                                  'Неизвестный формат ответа от RabbitMQ',
                                  default_logger='rabbitmq')

        logger = logging.getLogger('rabbitmq')
        logger.info('RPC answer:\n<see http response>\n')
        return resp

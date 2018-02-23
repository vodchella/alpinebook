import os
import asyncio
from passlib.hash import argon2
from ipaddress import IPv4Network, IPv4Address
from pkg.postgresql.executor import Executor
from pkg.postgresql.builder import QueryBuilder
from pkg.utils.auth_helper import AuthHelper
from pkg.utils.decorators.validate_request import validate_request
from pkg.utils.decorators.handle_exceptions import handle_exceptions
from pkg.utils.errors import *
from pkg.constants import APPLICATION_VERSION
from pkg.constants.error_codes import *
from pkg.constants import CONFIG
from asyncpg.exceptions import UniqueViolationError
from sanic import response
from . import app, v1


#
# Аутентификация
#


@v1.post('/users/<user_name:[A-z0-9@-_\.]+>/change-password')
@handle_exceptions
async def change_user_password(request, user_name: str):
    result = 0
    jwt, user = await AuthHelper().get_jwt_and_user_from_request(request)
    if 'old' in request.raw_args and 'new' in request.raw_args:
        if user and user_name == user['name'] and user['active']:
            if AuthHelper().verify_user_password(request, user['password'], pswd_param_name='old'):
                user_id = jwt['id'] if jwt else 0
                hash = AuthHelper().get_hash_from_password(request.raw_args['new'],
                                                           user['utc_created_at'].encode('utf-8'))
                result = await Executor(request).query_one(app.db_queries['update_user_password'], hash, user_id)
                user['password'] = hash
                await app.mongo.upsert_user(user)
                await asyncio.sleep(2)
    return response.json({'updated': result})


@v1.post('/users/<user_name:[A-z0-9@-_\.]+>/signin')
@handle_exceptions
async def signin(request, user_name: str):
    if 'method' in request.raw_args:
        method = request.raw_args['method'].lower()

        # Для этих методов аутентификации подключения разрешены только
        # с внутренних доверенных адресов, т.к. они не запрашивают пароль
        if method in ('telegram', 'trusted'):
            request_ip = IPv4Address(request.ip)
            block_connect = True
            try:
                trusted_subnet = IPv4Network(CONFIG['http']['trusted-subnet'])
                try:
                    gateway = IPv4Address(CONFIG['http']['gateway'])
                except:
                    # Это не говнокод, просто так оно работает куда быстрее, нежели вызов trusted_subnet.hosts()
                    # Вызов trusted_subnet.hosts() будет выискивать реально используемые хосты, а это нам не нужно
                    i = 0
                    for gateway in trusted_subnet:
                        i += 1
                        if i > 1:
                            break
                if request_ip != gateway:
                    block_connect = request_ip not in trusted_subnet
            except:
                block_connect = request_ip != IPv4Address('127.0.0.1')
            if block_connect:
                return response_error(ERROR_IP_ADDRESS_NOT_ALLOWED,
                                      'Запрещённый ip-адрес для данного типа аутентификации')

        if method == 'telegram':
            field_param = 'telegram_id'
            field_name = 'telegram_name'
            try:
                telegram_id = int(user_name)
                param = telegram_id
            except ValueError:
                return response_error(ERROR_INVALID_IDENTIFIER, 'Неверный идентификатор Telegram', log_stacktrace=False)
        elif method in ('trusted', 'password'):
            field_param = 'email'
            field_name = 'email'
            param = user_name
        else:
            return response_error(ERROR_INVALID_AUTH_METHOD_SPECIFIED, 'Указан неверный метод аутентификации')

        sql = app.db_queries['get_user_by_param'] % (field_name, field_param)
        user = await Executor(request).query_one_json(sql, param)

        allow_signin = False
        if user and user['id']:
            if user['active']:
                if method == 'password':
                    if 'password' in request.raw_args:
                        allow_signin = AuthHelper().verify_user_password(request, user['password'])
                elif method in ('telegram', 'trusted'):
                    allow_signin = True

                if allow_signin:
                    await app.mongo.upsert_user(user)
                    return response.json({'jwt': AuthHelper().create_jwt_by_user(user)})
                else:
                    await asyncio.sleep(2)
            else:
                return response_error(ERROR_USER_NOT_ACTIVE, 'Пользователь заблокирован')

        if not allow_signin:
            return response_error(ERROR_INVALID_CREDENTIALS, 'Пара логин/пароль неверна')

    else:
        return response_error(ERROR_NO_AUTH_METHOD_SPECIFIED, 'Не указан метод аутентификации')


#
# Методы для работы с восхождениями альпиниста
#


@v1.get('/summits/alpinist/<alpinist_id:[A-z0-9]+>')
@handle_exceptions
async def get_summits(request, alpinist_id: str):
    full = False
    if 'full_route_info' in request.raw_args:
        full = request.raw_args['full_route_info'].lower() == 'true'
    return response.json(await Executor(request, False).query_all_json(app.db_queries['get_summits'],
                                                                       alpinist_id,
                                                                       full))


@v1.delete('/summits/<summit_id:[A-z0-9]+>')
@handle_exceptions
async def delete_summit(request, summit_id: str):
    query_data = QueryBuilder('summits').generate_delete()
    result = await Executor(request).query_one(query_data['sql'], summit_id)
    return response.json({'deleted': result})


@v1.put('/summits/<summit_id:[A-z0-9]+>')
@validate_request('summits')
@handle_exceptions
async def update_summit(request, summit_id: str):
    query_data = QueryBuilder('summits').generate_update(request.json)
    result = await Executor(request).query_one(query_data['sql'], summit_id, *query_data['values'])
    return response.json({'updated': result})


@v1.post('/summits')
@validate_request('summits')
@handle_exceptions
async def insert_summit(request):
    try:
        query_data = QueryBuilder('summits').generate_insert(request.json)
        result = await Executor(request).query_one(query_data['sql'], *query_data['values'])
        return response.json({'new_id': result})
    except UniqueViolationError:
        return response_error(ERROR_UNIQUE_VIOLATION, 'Запись с таким идентификатором уже существует')


#
# Просмотр справочников
#


@v1.get('/regions')
@handle_exceptions
async def list_regions(request):
    return response.json(await Executor(request, False).query_all_json(app.db_queries['get_regions']))


@v1.get('/regions/<region_id:[A-z0-9]+>')
@handle_exceptions
async def get_region(request, region_id: str):
    return response.json(await Executor(request, False).query_one_json(app.db_queries['get_region'], region_id))


@v1.get('/regions/<region_id:[A-z0-9]+>/areas')
@handle_exceptions
async def list_areas(request, region_id: str):
    return response.json(await Executor(request, False).query_all_json(app.db_queries['get_areas'], region_id))


@v1.get('/areas/<area_id:[A-z0-9]+>')
@handle_exceptions
async def get_area(request, area_id: str):
    return response.json(await Executor(request, False).query_one_json(app.db_queries['get_area'], area_id))


@v1.get('/areas/<area_id:[A-z0-9]+>/mountains')
@handle_exceptions
async def list_mountains(request, area_id: str):
    result = []
    if 'search' in request.raw_args:
        search = request.raw_args['search'].strip()
        if search:
            result = await Executor(request, False).query_all_json(app.db_queries['search_mountains'],
                                                                   search, True, area_id)
        return response.json(result)
    else:
        return response.json(await Executor(request, False).query_all_json(app.db_queries['get_mountains'], area_id))


@v1.get('/mountains')
@handle_exceptions
async def search_mountains(request):
    result = []
    if 'search' in request.raw_args:
        search = request.raw_args['search'].strip()
        if search:
            result = await Executor(request, False).query_all_json(app.db_queries['search_mountains'],
                                                                   search, False, '')
    return response.json(result)


@v1.get('/mountains/<mountain_id:[A-z0-9]+>')
@handle_exceptions
async def get_mountain(request, mountain_id: str):
    return response.json(await Executor(request, False).query_one_json(app.db_queries['get_mountain'], mountain_id))


@v1.get('/mountains/<mountain_id:[A-z0-9]+>/routes')
@handle_exceptions
async def list_routes(request, mountain_id: str):
    return response.json(await Executor(request, False).query_all_json(app.db_queries['get_routes'], mountain_id))


@v1.get('/routes/<route_id:[A-z0-9]+>')
@handle_exceptions
async def get_route(request, route_id: str):
    return response.json(await Executor(request, False).query_one_json(app.db_queries['get_route'], route_id))


#
#  Отчётность
#


async def process_report(request, report_name, report_type):
    jwt = await AuthHelper().get_jwt_from_request(request, return_encoded=True)
    if not app.rabbitmq:
        return response_error(ERROR_RABBITMQ_NOT_AVAIBLE,
                              'Соединение с RabbitMQ пока не установлено, попробуйте позже',
                              default_logger='rabbitmq')
    result = await app.rabbitmq.rpc_call(f'generate_{report_type}', dict(jwt=jwt,
                                                                         report_name=report_name,
                                                                         params=request.raw_args))
    return app.rabbitmq.process_rpc_result(result)


@app.get('/reports/<report_name:[A-z0-9-]+>.html')
@handle_exceptions
async def html_report(request, report_name: str):
    return await process_report(request, report_name, 'html')


@app.get('/reports/<report_name:[A-z0-9-]+>.pdf')
@handle_exceptions
async def pdf_report(request, report_name: str):
    return await process_report(request, report_name, 'pdf')


#
#  Главная страница
#


@app.route('/')
async def main_page(request):
    return response.text(APPLICATION_VERSION)


#
#  Статика
#

app.static('/favicon.png', './pkg/app/static/images/favicon.png')
app.static('/favicon.ico', './pkg/app/static/images/favicon.ico')
app.static('/css', './pkg/app/static/css')

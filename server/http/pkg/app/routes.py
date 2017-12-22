from pkg.postgresql.executor import Executor
from pkg.postgresql.builder import QueryBuilder
from pkg.utils.auth_helper import AuthHelper
from pkg.utils.decorators.validate_request import validate_request
from pkg.utils.decorators.handle_exceptions import handle_exceptions
from pkg.utils.errors import *
from pkg.constants import APPLICATION_VERSION
from asyncpg.exceptions import UniqueViolationError
from sanic import response
from . import app


#
# Авторизация
#


@app.route('/users/signin/<user_name:[A-z0-9@-_\.]+>', methods=['POST'])
@handle_exceptions
async def signin(request, user_name: str):
    if 'method' in request.raw_args:
        method = request.raw_args['method'].lower()

        # Для этих методов авторизации подключения разрешены только
        # с локальных адресов, т.к. они не запрашивают пароль
        if method in ('telegram', 'trusted'):
            ip = request.ip[0]
            if ip != '127.0.0.1':
                return response_error(ERROR_IP_ADDRESS_NOT_ALLOWED, 'Подключения с внешних адресов запрещены')

        if method == 'telegram':
            field = 'telegram_id'
            try:
                telegram_id = int(user_name)
                param = telegram_id
            except ValueError:
                return response_error(ERROR_INVALID_IDENTIFIER, 'Неверный идентификатор Telegram', log_stacktrace=False)
        elif method == 'trusted':
            field = 'email'
            param = user_name
        else:
            return response_error(ERROR_INVALID_AUTH_METHOD_SPECIFIED, 'Указан неверный метод авторизации')

        sql = app.db_queries['get_user_by_param'] % field
        user = await Executor(request).query_one_json(sql, param)
        if user['id']:
            if user['active']:
                return response.json({'jwt': AuthHelper().create_jwt_by_user(user)})
            else:
                return response_error(ERROR_USER_NOT_ACTIVE, 'Пользователь заблокирован')
        else:
            return response_error(ERROR_INVALID_CREDENTIALS, 'Пара логин/пароль неверна')

    else:
        return response_error(ERROR_NO_AUTH_METHOD_SPECIFIED, 'Не указан метод авторизации')


#
# Методы для работы с восхождениями альпиниста
#


@app.route('/summits/alpinist/<alpinist_id:int>', methods=['GET'])
@handle_exceptions
async def get_summits(request, alpinist_id: int):
    full = False
    if 'full_route_info' in request.raw_args:
        full = request.raw_args['full_route_info'].lower() == 'true'
    return response.json(await Executor(request, False).query_all_json(app.db_queries['get_summits'],
                                                                       alpinist_id,
                                                                       full))


@app.route('/summits/<summit_id:int>', methods=['DELETE'])
@handle_exceptions
async def delete_summit(request, summit_id: int):
    query_data = QueryBuilder('summits').generate_delete()
    result = await Executor(request).query_one(query_data['sql'], summit_id)
    return response.json({'deleted': result})


@app.route('/summits/<summit_id:int>', methods=['PUT'])
@validate_request('summits')
@handle_exceptions
async def update_summit(request, summit_id: int):
    query_data = QueryBuilder('summits').generate_update(request.json)
    result = await Executor(request).query_one(query_data['sql'], summit_id, *query_data['values'])
    return response.json({'updated': result})


@app.route('/summits', methods=['POST'])
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


@app.route('/regions', methods=['GET'])
@handle_exceptions
async def list_regions(request):
    return response.json(await Executor(request, False).query_all_json(app.db_queries['get_regions']))


@app.route('/regions/<region_id:int>', methods=['GET'])
@handle_exceptions
async def get_region(request, region_id: int):
    return response.json(await Executor(request, False).query_one_json(app.db_queries['get_region'], region_id))


@app.route('/regions/<region_id:int>/areas', methods=['GET'])
@handle_exceptions
async def list_areas(request, region_id: int):
    return response.json(await Executor(request, False).query_all_json(app.db_queries['get_areas'], region_id))


@app.route('/areas/<area_id:int>', methods=['GET'])
@handle_exceptions
async def get_area(request, area_id: int):
    return response.json(await Executor(request, False).query_one_json(app.db_queries['get_area'], area_id))


@app.route('/areas/<area_id:int>/mountains', methods=['GET'])
@handle_exceptions
async def list_mountains(request, area_id: int):
    return response.json(await Executor(request, False).query_all_json(app.db_queries['get_mountains'], area_id))


@app.route('/mountains/<mountain_id:int>', methods=['GET'])
@handle_exceptions
async def get_mountain(request, mountain_id: int):
    return response.json(await Executor(request, False).query_one_json(app.db_queries['get_mountain'], mountain_id))


@app.route('/mountains/<mountain_id:int>/routes', methods=['GET'])
@handle_exceptions
async def list_routes(request, mountain_id: int):
    return response.json(await Executor(request, False).query_all_json(app.db_queries['get_routes'], mountain_id))


@app.route('/routes/<route_id:int>', methods=['GET'])
@handle_exceptions
async def get_route(request, route_id: int):
    return response.json(await Executor(request, False).query_one_json(app.db_queries['get_route'], route_id))


#
#  Главная страница
#
@app.route('/')
async def main_page(request):
    return response.text(APPLICATION_VERSION)

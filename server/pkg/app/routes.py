from pkg.postgresql.executor import Executor
from pkg.postgresql.builder import QueryBuilder
from pkg.utils.decorators.validate_request import validate_request
from pkg.utils.decorators.handle_exceptions import handle_exceptions
from pkg.utils.errors import response_error, ERROR_UNIQUE_VIOLATION
from asyncpg.exceptions import UniqueViolationError
from sanic import response
from . import app


#
# Методы для работы с восхождениями альпиниста
#


@app.route('/summits/alpinist/<alpinist_id:int>', methods=['GET'])
@handle_exceptions
async def get_summits(request, alpinist_id: int):
    return response.json(await Executor(request).query_all_json(app.db_queries['get_summits'], alpinist_id))


@app.route('/summits/<summit_id:int>', methods=['DELETE'])
@handle_exceptions
async def delete_summit(request, summit_id: int):
    query_data = QueryBuilder('alpinist_summits').generate_delete()
    result = await Executor(request).query_one(query_data['sql'], summit_id)
    return response.json({'deleted': result})


@app.route('/summits/<summit_id:int>', methods=['POST'])
@validate_request('alpinist_summits')
@handle_exceptions
async def update_summit(request, summit_id: int):
    query_data = QueryBuilder('alpinist_summits').generate_update(request.json)
    result = await Executor(request).query_one(query_data['sql'], summit_id, *query_data['values'])
    return response.json({'updated': result})


@app.route('/summits', methods=['POST'])
@validate_request('alpinist_summits')
@handle_exceptions
async def insert_summit(request):
    try:
        query_data = QueryBuilder('alpinist_summits').generate_insert(request.json)
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
    return response.json(await Executor(request).query_all_json(app.db_queries['get_regions']))


@app.route('/regions/<region_id:int>', methods=['GET'])
@handle_exceptions
async def get_region(request, region_id: int):
    return response.json(await Executor(request).query_one_json(app.db_queries['get_region'],
                                                         region_id))


@app.route('/regions/<region_id:int>/areas', methods=['GET'])
@handle_exceptions
async def list_areas(request, region_id: int):
    return response.json(await Executor(request).query_all_json(app.db_queries['get_areas'],
                                                         region_id))


@app.route('/regions/<region_id:int>/areas/<area_id:int>', methods=['GET'])
@handle_exceptions
async def get_area(request, region_id: int, area_id: int):
    return response.json(await Executor(request).query_one_json(app.db_queries['get_area'],
                                                         region_id, area_id))


@app.route('/regions/<region_id:int>/areas/<area_id:int>/mountains', methods=['GET'])
@handle_exceptions
async def list_mountains(request, region_id: int, area_id: int):
    return response.json(await Executor(request).query_all_json(app.db_queries['get_mountains'],
                                                         region_id, area_id))


@app.route('/regions/<region_id:int>/areas/<area_id:int>/mountains/<mountain_id:int>',
           methods=['GET'])
@handle_exceptions
async def get_mountain(request, region_id: int, area_id: int, mountain_id: int):
    return response.json(await Executor(request).query_one_json(app.db_queries['get_mountain'],
                                                         region_id, area_id, mountain_id))


@app.route('/regions/<region_id:int>/areas/<area_id:int>/mountains/<mountain_id:int>/routes',
           methods=['GET'])
@handle_exceptions
async def list_routes(request, region_id: int, area_id: int, mountain_id: int):
    return response.json(await Executor(request).query_all_json(app.db_queries['get_routes'],
                                                         region_id, area_id, mountain_id))


@app.route('/regions/<region_id:int>/areas/<area_id:int>/mountains/<mountain_id:int>/routes/<route_id:int>',
           methods=['GET'])
@handle_exceptions
async def get_route(request, region_id: int, area_id: int, mountain_id: int, route_id: int):
    return response.json(await Executor(request).query_one_json(app.db_queries['get_route'],
                                                         region_id, area_id, mountain_id, route_id))

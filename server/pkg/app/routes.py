from pkg.postgresql.executor import Executor
from pkg.postgresql.builder import QueryBuilder
from pkg.utils.decorators.validate_request import validate_request
from pkg.utils.errors import response_error, ERROR_UNIQUE_VIOLATION
from asyncpg.exceptions import UniqueViolationError
from sanic import response
from . import app


@app.route('/summits', methods=['POST'])
@validate_request('alpinist_summits')
async def insert_summit(request):
    query_data = QueryBuilder('alpinist_summits').generate_insert(request.json)
    try:
        result = await Executor(request).query_one(query_data['sql'], *query_data['values'])
        return response.json({'new_id': result})
    except UniqueViolationError:
        return response_error(ERROR_UNIQUE_VIOLATION, 'Запись с таким идентификатором уже существует')


#
# Просмотр справочников
#


@app.route('/regions', methods=['GET'])
async def list_regions(request):
    return response.json(await Executor(request).query_all_json(app.db_queries['get_regions']))


@app.route('/regions/<region_id:int>', methods=['GET'])
async def get_region(request, region_id: int):
    return response.json(await Executor(request).query_one_json(app.db_queries['get_region'],
                                                         region_id))


@app.route('/regions/<region_id:int>/areas',
           methods=['GET'])
async def list_regions(request, region_id: int):
    return response.json(await Executor(request).query_all_json(app.db_queries['get_areas'],
                                                         region_id))


@app.route('/regions/<region_id:int>/areas/<area_id:int>', methods=['GET'])
async def list_regions(request, region_id: int, area_id: int):
    return response.json(await Executor(request).query_one_json(app.db_queries['get_area'],
                                                         region_id, area_id))


@app.route('/regions/<region_id:int>/areas/<area_id:int>/mountains', methods=['GET'])
async def list_regions(request, region_id: int, area_id: int):
    return response.json(await Executor(request).query_all_json(app.db_queries['get_mountains'],
                                                         region_id, area_id))


@app.route('/regions/<region_id:int>/areas/<area_id:int>/mountains/<mountain_id:int>',
           methods=['GET'])
async def list_regions(request, region_id: int, area_id: int, mountain_id: int):
    return response.json(await Executor(request).query_one_json(app.db_queries['get_mountain'],
                                                         region_id, area_id, mountain_id))


@app.route('/regions/<region_id:int>/areas/<area_id:int>/mountains/<mountain_id:int>/routes',
           methods=['GET'])
async def list_regions(request, region_id: int, area_id: int, mountain_id: int):
    return response.json(await Executor(request).query_all_json(app.db_queries['get_routes'],
                                                         region_id, area_id, mountain_id))


@app.route('/regions/<region_id:int>/areas/<area_id:int>/mountains/<mountain_id:int>/routes/<route_id:int>',
           methods=['GET'])
async def list_regions(request, region_id: int, area_id: int, mountain_id: int, route_id: int):
    return response.json(await Executor(request).query_one_json(app.db_queries['get_route'],
                                                         region_id, area_id, mountain_id, route_id))

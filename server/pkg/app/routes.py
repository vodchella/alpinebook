from pkg.postgresql.executor import Executor
from pkg.postgresql.builder import QueryBuilder
from pkg.utils.decorators.validate_request import validate_request
from pkg.utils.errors import response_error, get_raised_error
from pkg.utils.errors import ERROR_INTERNAL_EXCEPTION, ERROR_DATABASE_EXCEPTION, ERROR_UNIQUE_VIOLATION
from asyncpg.exceptions import UniqueViolationError
from asyncpg.exceptions._base import PostgresError
from sanic import response
from . import app


@app.route('/summits/alpinist/<alpinist_id:int>', methods=['GET'])
async def get_summits(request, alpinist_id: int):
    return response.json(await Executor(request).query_all_json(app.db_queries['get_summits'], alpinist_id))


@app.route('/summits/<summit_id:int>', methods=['POST'])
@validate_request('alpinist_summits')
async def update_summit(request, summit_id: int):
    try:
        query_data = QueryBuilder('alpinist_summits').generate_update(request.json)
        result = await Executor(request).query_one(query_data['sql'], summit_id, *query_data['values'])
        return response.json({'updated': result})
    except PostgresError as e:
        return response_error(ERROR_DATABASE_EXCEPTION, str(e))
    except:
        return response_error(ERROR_INTERNAL_EXCEPTION, get_raised_error())


@app.route('/summits', methods=['POST'])
@validate_request('alpinist_summits')
async def insert_summit(request):
    try:
        query_data = QueryBuilder('alpinist_summits').generate_insert(request.json)
        result = await Executor(request).query_one(query_data['sql'], *query_data['values'])
        return response.json({'new_id': result})
    except UniqueViolationError:
        return response_error(ERROR_UNIQUE_VIOLATION, 'Запись с таким идентификатором уже существует')
    except PostgresError as e:
        return response_error(ERROR_DATABASE_EXCEPTION, str(e))
    except:
        return response_error(ERROR_INTERNAL_EXCEPTION, get_raised_error())


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
async def list_areas(request, region_id: int):
    return response.json(await Executor(request).query_all_json(app.db_queries['get_areas'],
                                                         region_id))


@app.route('/regions/<region_id:int>/areas/<area_id:int>', methods=['GET'])
async def get_area(request, region_id: int, area_id: int):
    return response.json(await Executor(request).query_one_json(app.db_queries['get_area'],
                                                         region_id, area_id))


@app.route('/regions/<region_id:int>/areas/<area_id:int>/mountains', methods=['GET'])
async def list_mountains(request, region_id: int, area_id: int):
    return response.json(await Executor(request).query_all_json(app.db_queries['get_mountains'],
                                                         region_id, area_id))


@app.route('/regions/<region_id:int>/areas/<area_id:int>/mountains/<mountain_id:int>',
           methods=['GET'])
async def get_mountain(request, region_id: int, area_id: int, mountain_id: int):
    return response.json(await Executor(request).query_one_json(app.db_queries['get_mountain'],
                                                         region_id, area_id, mountain_id))


@app.route('/regions/<region_id:int>/areas/<area_id:int>/mountains/<mountain_id:int>/routes',
           methods=['GET'])
async def list_routes(request, region_id: int, area_id: int, mountain_id: int):
    return response.json(await Executor(request).query_all_json(app.db_queries['get_routes'],
                                                         region_id, area_id, mountain_id))


@app.route('/regions/<region_id:int>/areas/<area_id:int>/mountains/<mountain_id:int>/routes/<route_id:int>',
           methods=['GET'])
async def get_route(request, region_id: int, area_id: int, mountain_id: int, route_id: int):
    return response.json(await Executor(request).query_one_json(app.db_queries['get_route'],
                                                         region_id, area_id, mountain_id, route_id))

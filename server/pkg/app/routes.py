from pkg.postgresql.executor import Executor
from sanic import response
from . import app


@app.route('/regions', methods=['GET'])
async def list_regions(request):
    return response.json(await Executor().query_all(app.db_statements['get_regions']))


@app.route('/regions/<region_id:int>', methods=['GET'])
async def get_region(request, region_id: int):
    return response.json(await Executor().query_one(app.db_statements['get_region'], region_id))


@app.route('/regions/<region_id:int>/areas', methods=['GET'])
async def list_regions(request, region_id: int):
    return response.json(await Executor().query_all(app.db_statements['get_areas'], region_id))


@app.route('/regions/<region_id:int>/areas/<area_id:int>', methods=['GET'])
async def list_regions(request, region_id: int, area_id: int):
    return response.json(await Executor().query_all(app.db_statements['get_area'], region_id, area_id))


@app.route('/regions/<region_id:int>/areas/<area_id:int>/mountains', methods=['GET'])
async def list_regions(request, region_id: int, area_id: int):
    return response.json(await Executor().query_all(app.db_statements['get_mountains'], region_id, area_id))


@app.route('/regions/<region_id:int>/areas/<area_id:int>/mountains/<mountain_id:int>', methods=['GET'])
async def list_regions(request, region_id: int, area_id: int, mountain_id: int):
    return response.json(await Executor().query_all(app.db_statements['get_mountain'], region_id, area_id, mountain_id))


@app.route('/regions/<region_id:int>/areas/<area_id:int>/mountains/<mountain_id:int>/routes', methods=['GET'])
async def list_regions(request, region_id: int, area_id: int, mountain_id: int):
    return response.json(await Executor().query_all(app.db_statements['get_routes'], region_id, area_id, mountain_id))

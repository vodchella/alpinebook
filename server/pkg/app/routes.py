from pkg.postgresql.executor import Executor
from sanic import response
from . import app


@app.route("/regions")
async def list_regions(request):
    return response.json(await Executor().query_all(app.db_statements['get_regions']))


@app.route("/regions/<region_id:int>")
async def get_region(request, region_id: int):
    return response.json(await Executor().query_one(app.db_statements['get_region'], region_id))


@app.route("/areas")
async def list_regions(request):
    return response.json(await Executor().query_all(app.db_statements['get_areas']))


@app.route("/areas/<area_id:int>")
async def list_regions(request, area_id: int):
    return response.json(await Executor().query_all(app.db_statements['get_area'], area_id))

from sanic import Sanic
from pkg.utils.logging import setup_logging


setup_logging()
app = Sanic()
app.db_queries = {}

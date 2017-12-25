from sanic import Sanic
from pkg.utils.logging import setup_logging
from pkg.utils.console import panic


try:
    setup_logging()
    app = Sanic()
except:
    panic()

app.db_queries = {}
app.rabbitmq = None

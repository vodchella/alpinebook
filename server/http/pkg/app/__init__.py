from sanic import Sanic
from pkg.utils.logging import LOGGING
from pkg.utils.console import panic


try:
    app = Sanic(log_config=LOGGING)
except:
    panic()

app.db_queries = {}
app.rabbitmq = None

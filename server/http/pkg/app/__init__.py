from sanic import Sanic, Blueprint
from pkg.utils.logging import LOGGING
from pkg.utils.console import panic


try:
    app = Sanic(__name__, log_config=LOGGING)
    v1 = Blueprint('v1', url_prefix='/api/v1')
except:
    panic()

app.db_queries = {}
app.rabbitmq = None
app.mongo = None

import importlib
from pkg.app import app

if __name__ == '__main__':
    for md in ['regions', 'listeners', 'middleware', 'exceptions']:
        importlib.import_module('pkg.app.' + md)
    app.run(host='localhost', port=8000)

import importlib
from os import path
from glob import glob
from pkg.app import app

if __name__ == '__main__':
    for md in [path.basename(x)[:-3] for x in glob('./pkg/app/*.py') if x[-11:] != '__init__.py']:
        importlib.import_module('pkg.app.' + md)
    app.run(host='localhost', port=8000)

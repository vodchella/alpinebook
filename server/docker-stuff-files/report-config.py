CONFIG = {
    'name': 'PRODUCTION',
    'debug': False,
    'http': {
        'listen-host': 'alpinebook-server-host',
        'listen-port': 8000
    },
    'rabbit': {
        'host': '127.0.0.1',
        'port': 5672,
        'user': 'guest',
        'pass': 'guest'
    },
    'logging': {
        'file-name': '/var/log/alpinebook/report.log',
        'disabled': False
    }
}

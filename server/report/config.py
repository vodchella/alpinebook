CONFIG = {
    'name': 'DEVELOPMENT',
    'debug': True,
    'http': {
        'listen-host': 'localhost',
        'listen-port': 8000
    },
    'rabbit': {
        'host': 'localhost',
        'port': 5672,
        'user': 'guest',
        'pass': 'guest'
    },
    'logging': {
        'file-name': 'alpinebook-report.log',
        'disabled': True
    }
}

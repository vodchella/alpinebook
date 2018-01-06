CONFIG = {
    'name': 'DEVELOPMENT',
    'debug': True,
    'http': {
        'host': 'alpinebook-http-server',
        'port': 8001
    },
    'rabbit': {
        'host': 'alpinebook-mq',
        'port': 5672,
        'user': 'guest',
        'pass': 'guest',
        'max_conn_attempts': 20
    },
    'logging': {
        'file-name': '/var/log/alpinebook/report.log',
        'disabled': False
    }
}

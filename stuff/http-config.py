CONFIG = {
    'name': 'DEVELOPMENT',
    'debug': True,
    'http': {
        'listen-host': '127.0.0.1',
        'listen-port': 8000
    },
    'postgres': {
        'host': 'alpinebook-postgres',
        'port': 54320,
        'user': 'postgres',
        'pass': 'postgres',
        'db': 'alpinebook_dev',
        'ssl': False,
        'pool': {
            'min_size': 1,
            'max_size': 10,
            'max_inactive_connection_lifetime': 0,
            'command_timeout': 60
        }
    },
    'rabbit': {
        'host': '127.0.0.1',
        'port': 5672,
        'user': 'guest',
        'pass': 'guest'
    },
    'logging': {
        'file-name': '/var/log/alpinebook/alpinebook-http.log',
        'disabled': False
    }
}

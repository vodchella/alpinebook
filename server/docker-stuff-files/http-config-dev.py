CONFIG = {
    'name': 'DEVELOPMENT',
    'debug': True,
    'http': {
        'listen-host': 'alpinebook-server-host',
        'listen-port': 8001
    },
    'postgres': {
        'host': 'alpinebook-postgres-host',
        'port': 5432,
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
        'file-name': '/var/log/alpinebook/http-dev.log',
        'disabled': False
    }
}

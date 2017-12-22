CONFIG = {
    'name': 'DEVELOPMENT',
    'debug': True,
    'http': {
        'listen-host': 'localhost',
        'listen-port': 8000
    },
    'postgres': {
        'host': 'localhost',
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
    'logging': {
        'file-name': 'alpinebook-http.log',
        'disabled': False
    }
}

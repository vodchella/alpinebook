CONFIG = {
    'name': 'DEVELOPMENT',
    'debug': True,
    'http': {
        'listen-host': 'alpinebook-http-server',
        'listen-port': 8001,
        'trusted-subnet': '172.19.0.0/16',
        'gateway': '172.19.0.1'
    },
    'postgres': {
        'host': 'alpinebook-postgres',
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
        },
        'max_conn_attempts': 120
    },
    'rabbit': {
        'host': 'alpinebook-rabbit',
        'port': 5672,
        'user': 'guest',
        'pass': 'guest',
        'max_conn_attempts': 20
    },
    'logging': {
        'file-name': '/var/log/alpinebook/http.log',
        'disabled': False
    }
}

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
            'min-size': 1,
            'max-size': 10,
            'max-inactive-connection-lifetime': 0,
            'command-timeout': 60
        },
        'max-conn-attempts': 120
    },
    'rabbit': {
        'host': 'alpinebook-rabbit',
        'port': 5672,
        'user': 'guest',
        'pass': 'guest',
        'max-conn-attempts': 20
    },
    'mongo': {
        'host': 'alpinebook-mongo',
        'port': 27017,
        'connect-timeout': 1,
        'max-conn-attempts': 20
    },
    'logging': {
        'file-name': '/var/log/alpinebook/http.log',
        'disabled': False
    }
}

CONFIG = {
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
        'db': 'alpinebook_dev'
    },
    'logging': {
        'file-name': 'alpinebook.log',
        'disabled': True
    }
}
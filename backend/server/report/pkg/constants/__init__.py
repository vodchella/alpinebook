from pkg.utils.git import get_top_commit

DEBUG = False
CONFIG = None
HTTP_SERVER_URL = None
APPLICATION_NAME = 'AlpineBook Report Server'
VERSION = '0.01'
APPLICATION_VERSION = f'{APPLICATION_NAME} v{VERSION}'

git_commit = get_top_commit()
if git_commit:
    APPLICATION_VERSION += f'.{git_commit}'

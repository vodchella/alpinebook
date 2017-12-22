from pkg.utils.git import get_top_commit

DEBUG = False
APPLICATION_NAME = 'AlpineBook'
VERSION = '0.01'
APPLICATION_VERSION = APPLICATION_NAME + ' v' + VERSION
CONFIG = None

git_commit = get_top_commit()
if git_commit:
    APPLICATION_VERSION += '.' + git_commit

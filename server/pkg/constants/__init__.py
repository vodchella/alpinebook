from pkg.utils.git import get_top_commit

DEBUG = True
APPLICATION_NAME = 'AlpineBook'
VERSION = '0.01'
APPLICATION_VERSION = APPLICATION_NAME + ' v' + VERSION

git_commit = get_top_commit()
if git_commit:
    APPLICATION_VERSION += '.' + git_commit

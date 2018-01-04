import sys
import os
from pkg.utils.errors import get_raised_error


def write_stderr(line):
    sys.stderr.write(line)
    sys.stderr.flush()


def write_stdout(line):
    sys.stdout.write(line)
    sys.stdout.flush()


def panic(msg=None, show_original_error=False):
    if not msg:
        msg = get_raised_error()
    elif show_original_error:
        write_stderr(get_raised_error())
    write_stderr(f'{msg}\n')
    os._exit(1)

import sys
import os
import time
import psycopg2

i = 0
while i < 60:
    try:
        conn = psycopg2.connect("host=localhost port=5432 dbname=alpinebook_dev user=postgres password=postgres")
        os._exit(0)
    except psycopg2.OperationalError as ex:
        i += 1
        sys.stderr.write('Attempt to connect to PostgreSQL #%i failed with error\n%s\nWaiting two seconds...\n' % (i, str(ex)))
        sys.stderr.flush()
        time.sleep(2)
os._exit(1)

#!/bin/bash

service postgresql start
python3 /tmp/wait_for_postgres.py
/tmp/db/db_update.sh
service postgresql stop
/usr/lib/postgresql/9.6/bin/postgres -D /var/lib/postgresql/9.6/main -c config_file=/etc/postgresql/9.6/main/postgresql.conf
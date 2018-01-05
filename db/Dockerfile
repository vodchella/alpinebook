FROM ubuntu:16.04

EXPOSE 5432

RUN apt update
RUN apt install -y wget

WORKDIR /tmp
RUN echo "deb http://apt.postgresql.org/pub/repos/apt/ xenial-pgdg main" > /etc/apt/sources.list.d/pgdg.list \
    && wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | apt-key add -
RUN apt update
RUN apt install -y postgresql-9.6 default-jre python3-pip && pip3 install psycopg2
RUN wget https://github.com/liquibase/liquibase/releases/download/liquibase-parent-3.5.3/liquibase-3.5.3-bin.tar.gz \
    && mkdir /usr/share/liquibase \
    && tar \
            --extract \
            --file liquibase-3.5.3-bin.tar.gz \
            --directory /usr/share/liquibase \
    && rm liquibase-3.5.3-bin.tar.gz \
    && ln -s /usr/share/liquibase/liquibase /usr/bin/liquibase \
    && wget -O /usr/share/liquibase/postgresql-jdbc.jar https://jdbc.postgresql.org/download/postgresql-42.1.4.jar

ENV PGDATA /var/lib/postgresql/9.6/main

USER postgres
COPY ./stuff-files/wait_for_postgres.py /tmp/wait_for_postgres.py
COPY ./stuff-files/start_alpinebook_db.sh /usr/bin/start_alpinebook_db.sh
RUN chmod 777 /usr/bin/start_alpinebook_db.sh

RUN echo "listen_addresses='*'" >> /etc/postgresql/9.6/main/postgresql.conf \
    && echo "host all  all    172.17.0.0/16  md5" >> /etc/postgresql/9.6/main/pg_hba.conf \
    && echo "host all  all    172.19.0.0/16  md5" >> /etc/postgresql/9.6/main/pg_hba.conf \
    && echo "host all  all    127.0.0.1/32  md5" >> /etc/postgresql/9.6/main/pg_hba.conf \
    && service postgresql start \
    && psql --command "CREATE DATABASE alpinebook_dev" \
    && psql --command "ALTER USER postgres WITH PASSWORD 'postgres'"


ENV POSTGRES_JDBC /usr/share/liquibase/postgresql-jdbc.jar
ADD . /tmp/db

ENTRYPOINT ["/usr/bin/start_alpinebook_db.sh"]

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
ENV POSTGRES_JDBC /usr/share/liquibase/postgresql-jdbc.jar

RUN mkdir /etc/alpinebook
COPY ./docker-stuff-files/wait_for_postgres.py /etc/alpinebook/wait_for_postgres.py
COPY ./docker-stuff-files/start_alpinebook_db.sh /etc/alpinebook/start_alpinebook_db.sh
RUN chmod 777 /etc/alpinebook/start_alpinebook_db.sh

USER postgres
RUN echo "listen_addresses='*'" >> /etc/postgresql/9.6/main/postgresql.conf \
    && echo "host all  all    172.17.0.0/16  md5" >> /etc/postgresql/9.6/main/pg_hba.conf \
    && echo "host all  all    172.19.0.0/16  md5" >> /etc/postgresql/9.6/main/pg_hba.conf \
    && echo "host all  all    127.0.0.1/32  md5" >> /etc/postgresql/9.6/main/pg_hba.conf \
    && service postgresql start \
    && psql --command "CREATE DATABASE alpinebook_dev" \
    && psql --command "ALTER USER postgres WITH PASSWORD 'postgres'"

COPY . /etc/alpinebook/db

ENTRYPOINT ["/etc/alpinebook/start_alpinebook_db.sh"]

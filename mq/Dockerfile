FROM ubuntu:16.04

RUN apt update && apt install -y rabbitmq-server locales nano mc

RUN    locale-gen ru_RU \
    && locale-gen ru_RU.UTF-8 \
    && update-locale \
    && echo 'ru_RU.UTF-8 UTF-8' >> /etc/locale.gen \
    && dpkg-reconfigure -f noninteractive locales \
    && echo 'LANG=ru_RU.UTF-8' | tee /etc/default/locale

COPY ./rabbitmq.config /etc/rabbitmq/rabbitmq.config
COPY ./start.sh /tmp/start.sh

ENTRYPOINT ["/tmp/start.sh"]

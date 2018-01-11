FROM ubuntu:16.04

RUN apt update
RUN apt install -y locales nano mc

RUN apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 2930ADAE8CAF5059EE73BB4B58712A2291FA4AD5
RUN echo "deb [ arch=amd64,arm64,ppc64el,s390x ] http://repo.mongodb.com/apt/ubuntu xenial/mongodb-enterprise/3.6 multiverse" | tee /etc/apt/sources.list.d/mongodb-enterprise.list
RUN apt update
RUN apt install -y mongodb-enterprise

RUN    locale-gen ru_RU \
    && locale-gen ru_RU.UTF-8 \
    && update-locale \
    && echo 'ru_RU.UTF-8 UTF-8' >> /etc/locale.gen \
    && dpkg-reconfigure -f noninteractive locales \
    && echo 'LANG=ru_RU.UTF-8' | tee /etc/default/locale

ARG tz
RUN echo $tz > /etc/timezone

COPY ./mongod.conf /etc/mongod.conf

ENTRYPOINT ["mongod", "--config", "/etc/mongod.conf"]

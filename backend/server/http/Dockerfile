FROM ubuntu:16.04

RUN echo "deb http://ppa.launchpad.net/jonathonf/python-3.6/ubuntu xenial main" > /etc/apt/sources.list.d/python-3.6.list \
    && echo "deb-src http://ppa.launchpad.net/jonathonf/python-3.6/ubuntu xenial main" >> /etc/apt/sources.list.d/python-3.6.list \
    && apt-key adv --keyserver hkp://keyserver.ubuntu.com:11371 --recv-keys F06FC659

RUN apt update
RUN apt install -y python3.6 python3.6-dev build-essential locales wget curl nano mc htop
RUN curl https://bootstrap.pypa.io/get-pip.py | python3.6

RUN    mkdir /var/log/alpinebook \
    && mkdir /etc/alpinebook \
    && chmod 777 /etc/alpinebook \
    && chmod 777 /var/log/alpinebook \
    && locale-gen ru_RU \
    && locale-gen ru_RU.UTF-8 \
    && update-locale \
    && echo 'ru_RU.UTF-8 UTF-8' >> /etc/locale.gen \
    && dpkg-reconfigure -f noninteractive locales \
    && echo 'LANG=ru_RU.UTF-8' | tee /etc/default/locale

ENV LANG ru_RU.UTF-8
ENV LANGUAGE ru_RU.UTF-8
ENV LC_ALL ru_RU.UTF-8

ENV ALPINEBOOK_HTTP_CONFIG_PATH /etc/alpinebook/http-config.py

COPY ./requirements.txt /etc/alpinebook/http-requirements.txt
RUN pip3 install -r /etc/alpinebook/http-requirements.txt

ARG tz
RUN echo $tz > /etc/timezone

COPY ./config.py /etc/alpinebook/http-config.py
COPY . /usr/src/alpinebook/server/http
WORKDIR /usr/src/alpinebook/server/http

ENV GLOBAL_SALT uWW:Z_![xy$uGQ9{,]opF7f%`nV.=9XTUiX!u/9a*H,/oLWC
CMD /usr/src/alpinebook/server/http/server.py

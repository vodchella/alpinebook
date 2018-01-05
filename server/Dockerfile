FROM ubuntu:16.04

RUN echo "deb http://ppa.launchpad.net/jonathonf/python-3.6/ubuntu xenial main" > /etc/apt/sources.list.d/python-3.6.list \
    && echo "deb-src http://ppa.launchpad.net/jonathonf/python-3.6/ubuntu xenial main" >> /etc/apt/sources.list.d/python-3.6.list \
    && apt-key adv --keyserver hkp://keyserver.ubuntu.com:11371 --recv-keys F06FC659

RUN apt update
RUN apt install -y python3.6 python3.6-dev python2.7 python-pip build-essential rabbitmq-server locales wget curl nano mc
RUN curl https://bootstrap.pypa.io/get-pip.py | python3.6 \
    && pip2 install supervisor

RUN useradd -M -U -u 999 -s /dev/null alpinebook \
    && mkdir /var/log/alpinebook \
    && mkdir /var/log/supervisor \
    && mkdir /var/run/rabbitmq \
    && mkdir /etc/alpinebook \
    && mkdir /etc/supervisor \
    && chmod 777 /etc/alpinebook \
    && chmod 777 /var/log/supervisor \
    && chmod 777 /var/log/alpinebook \
    && chmod 777 /var/run/rabbitmq \
    && locale-gen ru_RU \
    && locale-gen ru_RU.UTF-8 \
    && update-locale \
    && echo 'ru_RU.UTF-8 UTF-8' >> /etc/locale.gen \
    && dpkg-reconfigure -f noninteractive locales \
    && echo 'LANG=ru_RU.UTF-8' | tee /etc/default/locale

ENV LANG ru_RU.UTF-8
ENV LANGUAGE ru_RU.UTF-8
ENV LC_ALL ru_RU.UTF-8

ENV ALPINEBOOK_REPORT_CONFIG_PATH /etc/alpinebook/report-config.py
ENV ALPINEBOOK_HTTP_CONFIG_PATH /etc/alpinebook/http-config.py

USER alpinebook
COPY ./http/requirements.txt /etc/alpinebook/http-requirements.txt
COPY ./report/requirements.txt /etc/alpinebook/report-requirements.txt
COPY . /usr/src/alpinebook
COPY ./docker-stuff-files/report-config.py /etc/alpinebook/report-config.py
COPY ./docker-stuff-files/http-config.py /etc/alpinebook/http-config.py
COPY ./docker-stuff-files/start_alpinebook_server.sh /etc/alpinebook/start.sh

USER root
RUN pip3 install -r /etc/alpinebook/http-requirements.txt && pip3 install -r /etc/alpinebook/report-requirements.txt \
    && ln -s /usr/src/alpinebook/http/server.py /usr/bin/alpinebook-http-server \
    && ln -s /usr/src/alpinebook/report/server.py /usr/bin/alpinebook-report-server
COPY ./docker-stuff-files/supervisord.conf /etc/supervisor/supervisord.conf

ENTRYPOINT ["/etc/alpinebook/start.sh"]

FROM ubuntu:16.04

RUN echo "deb http://ppa.launchpad.net/jonathonf/python-3.6/ubuntu xenial main" > /etc/apt/sources.list.d/python-3.6.list \
    && echo "deb-src http://ppa.launchpad.net/jonathonf/python-3.6/ubuntu xenial main" >> /etc/apt/sources.list.d/python-3.6.list \
    && apt-key adv --keyserver hkp://keyserver.ubuntu.com:11371 --recv-keys F06FC659

RUN apt update
RUN apt install -y python3.6 python3.6-dev python2.7 python-pip build-essential rabbitmq-server wget curl nano mc
RUN curl https://bootstrap.pypa.io/get-pip.py | python3.6 \
    && pip2 install supervisor

RUN mkdir /var/log/alpinebook \
    && mkdir /var/log/supervisor \
    && mkdir /etc/alpinebook \
    && mkdir /etc/supervisor

RUN wget -O /etc/alpinebook/http-requirements.txt https://www.dropbox.com/s/7ftkytbe6qxinxl/http-requirements.txt \
    && wget -O /etc/alpinebook/report-requirements.txt https://www.dropbox.com/s/bzj41epwotz7fye/report-requirements.txt \
    && pip3 install -r /etc/alpinebook/http-requirements.txt && pip3 install -r /etc/alpinebook/report-requirements.txt

ADD . /usr/src/alpinebook
#RUN pip3 install -r /usr/src/alpinebook/report/requirements.txt && pip3 install -r /usr/src/alpinebook/http/requirements.txt

RUN wget -O /etc/alpinebook/report-config.py https://www.dropbox.com/s/tc4r61m33s5qwxu/report-config.py \
    && wget -O /etc/alpinebook/http-config.py https://www.dropbox.com/s/t673ac2lvzvn8co/http-config.py \
    && wget -O /etc/supervisor/supervisord.conf https://www.dropbox.com/s/mi5lxthcpxfozw2/supervisord.conf \
    && wget -O /etc/alpinebook/start_alpinebook_server.sh https://www.dropbox.com/s/k9v9duawvk1pgid/start_alpinebook_server.sh \
    && chmod 777 /etc/alpinebook/start_alpinebook_server.sh
ENV ALPINEBOOK_REPORT_CONFIG_PATH /etc/alpinebook/report-config.py
ENV ALPINEBOOK_HTTP_CONFIG_PATH /etc/alpinebook/http-config.py

ENTRYPOINT ["/etc/alpinebook/start_alpinebook_server.sh"]

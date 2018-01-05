#!/bin/bash

rm /tmp/*
service rabbitmq-server start
supervisord -c /etc/supervisor/supervisord.conf
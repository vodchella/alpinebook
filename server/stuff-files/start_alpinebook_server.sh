#!/bin/bash

service rabbitmq-server start
supervisord -c /etc/supervisor/supervisord.conf
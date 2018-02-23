#!/bin/bash

rm /var/run/rabbitmq/pid
rmdir /var/run/rabbitmq
service rabbitmq-server start
while true; do sleep 3; done
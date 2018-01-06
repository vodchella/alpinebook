#!/bin/bash

rm /tmp/*
service rabbitmq-server start
while true; do sleep 1; done
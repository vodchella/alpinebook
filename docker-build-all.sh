#!/bin/bash
ROOT_PATH=$(cd $(dirname $0) && pwd);

cd $ROOT_PATH/rabbit
./docker-build.sh

cd $ROOT_PATH/db
./docker-build.sh

cd $ROOT_PATH/server/http
./docker-build.sh

cd $ROOT_PATH/server/report
./docker-build.sh
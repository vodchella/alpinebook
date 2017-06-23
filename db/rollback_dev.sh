#!/bin/bash

ROOT_PATH=$(cd $(dirname $0) && pwd);

liquibase --url=jdbc:postgresql://localhost:5432/alpinebook_dev?charSet=UTF8 --username=postgres --password=postgres --classpath=$ROOT_PATH:postgresql-jdbc.jar --logLevel=info --changeLogFile=changelog.xml rollback init
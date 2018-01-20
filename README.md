# Life Goal Application
A containerized django app with react front end for life goals reminder. Created this app for
developing a front-end and back-end decoupled application and experimenting with react framework. 

## Prerequisites:
* Docker-engine

## Built-up
This process will setup two containers of Postgres and jatintripathi/goal_balance(python 2.7)

Build required container and run with single command,
Run below command in root directory,
`docker-compose up`

If above command doesn't work try below mentioned shell script,
`build.sh`

This service will work on port 8080, on URL localhost:8080/api/home.
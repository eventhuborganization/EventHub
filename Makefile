SHELL=/bin/bash

all: build up


.PHONY:	build up clean cleanall down downrmi stop


build:	
	docker-compose build

up:	
	docker-compose up -d

cleanall: downrmi

clean:	down

downrmi:
	docker-compose down --rmi all

down:
	docker-compose down

stop:
	docker-compose stop

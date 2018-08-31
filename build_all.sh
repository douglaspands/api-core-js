#!/bin/bash
docker-compose -f ./compose-stack.yaml down
docker rm coreapi-app
docker rm coreapi-app
docker rmi douglaspands/core-api-js:2.2.4
docker-compose -f ./compose-stack.yaml up
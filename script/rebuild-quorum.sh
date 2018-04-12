#!/bin/bash

CMDNAME=`basename $0`

# Move to project root
ROOT_DIR=`dirname $0`/..
cd $ROOT_DIR

docker rm -f quorum
docker images | awk '/<none>/{print $3}' | xargs docker rmi

docker build -t quorum -f ./docker/quorum/Dockerfile .

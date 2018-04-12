#!/bin/bash

CMDNAME=`basename $0`

# Move to project root
ROOT_DIR=`dirname $0`/..
cd $ROOT_DIR

docker build -t quorum -f ./docker/quorum/Dockerfile .
docker build -t truffle -f ./docker/truffle/Dockerfile .

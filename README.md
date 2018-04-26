# What it is

Fork of [this repository](https://github.com/ConsenSys/quorum-docker-Nnodes).
With this repo, it is easy to modify quorum source code in go-lang, build and test at N-node environment.

# Setup

## prerequisite

[Docker for mac]() must be installed.


## Download submodule

Run below command in the top level directory for the first time after cloning.

```
$ git submodule update --init
```

## Build

In the top level directory:

```
$ sh script/build-all.sh
```

This will create 2 images `quorum` and `truffle`. 
`quorum` has executable binary built from the source at `/quorum` directory which is submodule of this repository.

## Running

Change to the *Nnodes/* directory. Edit the `ips` variable in *setup.sh* to list two or more IP addresses on the Docker network that will host nodes:

    ips=("172.13.0.2" "172.13.0.3" "172.13.0.4")

The IP addresses are needed for Constellation to work. Now run,

    ./setup.sh
    docker-compose up -d
    
This will set up as many Quorum nodes as IP addresses you supplied, each in a separate container, on a Docker network, all hopefully talking to each other.

    Nnodes> docker ps
    CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS              PORTS                     NAMES
    ca860bc74dd9        quorum              "/qdata/start-node.sh"   42 minutes ago      Up 42 minutes       0.0.0.0:27003->9000/tcp   nnodes_node_3_1
    8bd3c56a5811        quorum              "/qdata/start-node.sh"   42 minutes ago      Up 42 minutes       0.0.0.0:27001->9000/tcp   nnodes_node_1_1
    72b64cff36e0        quorum              "/qdata/start-node.sh"   42 minutes ago      Up 42 minutes       0.0.0.0:27002->9000/tcp   nnodes_node_2_1
    7f5a4dd6bef7        truffle             "/bin/sh -c 'tail -f…"   42 minutes ago      Up 42 minutes                                 nnodes_truffle_1


## Stopping

    docker-compose down
  
## Playing

### Interacting via Web3

You can enter truffle container with below command.

    docker exec -it nnodes_truffle_1 ash
    
Inside of container, you can do whatever with [truffle](https://github.com/trufflesuite/truffle) such as writing, compiling, and deploying solidity contracts.

`script` folder has some test script you can play with.

### Accessing the Geth console

If you have Geth installed on the host machine you can do the following from the *Nnodes* directory to attach to Node 1's console.

    geth attach qdata_1/dd/geth.ipc

Otherwise, the following will achieve the same thing, attaching via the Geth instance in the container.  If you do this, you'll have to copy transaction scripts used below into the *qdata_N* directories manually.

    docker exec -it Nnodes_node_1_1 geth attach /qdata/dd/geth.ipc

### Making transactions

We will demo the following, from Node 1's console.

1. Create a public contract (visible to all nodes)

2. Create a private contract with Node 2

3. Send a private transaction to update the contract state with node 2.

This is based on using the provided example *setup.sh* file as-is (three nodes).

#### Node 1 geth console

    > var abi = [{"constant":true,"inputs":[],"name":"storedData","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"x","type":"uint256"}],"name":"set","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"get","outputs":[{"name":"retVal","type":"uint256"}],"payable":false,"type":"function"},{"inputs":[{"name":"initVal","type":"uint256"}],"type":"constructor"}];
    undefined

    > loadScript("contract_pub.js")
    Contract transaction send: TransactionHash: 0x0e7ff9b609c0ba3a11de9cd4f51389c29dceacbac2f91e294346df86792d8d8f waiting to be mined...
    true
    Contract mined! Address: 0x1932c48b2bf8102ba33b4a6b545c32236e342f34
    [object Object]

    > var public = eth.contract(abi).at("0x1932c48b2bf8102ba33b4a6b545c32236e342f34")
    undefined
    > public.get()
    42

    > loadScript("contract_pri.js")
    Contract transaction send: TransactionHash: 0xa9b969f90c1144a49b4ab4abb5e2bfebae02ab122cdc22ca9bc564a740e40bcd waiting to be mined...
    true
    Contract mined! Address: 0x1349f3e1b8d71effb47b840594ff27da7e603d17
    [object Object]

    > var private = eth.contract(abi).at("0x1349f3e1b8d71effb47b840594ff27da7e603d17")
    undefined
    > private.get()
    42
    > private.set(65535, {privateFor: ["QfeDAys9MPDs2XHExtc84jKGHxZg/aj52DTh0vtA3Xc="]})
    "0x0dc9c0b85b4c4e5f1e3ba2014b5f628f5153bc2588741a69626eb5a40d2b30d6"
    > private.get()
    65535

#### Node 2 geth console

    > var abi = [{"constant":true,"inputs":[],"name":"storedData","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"x","type":"uint256"}],"name":"set","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"get","outputs":[{"name":"retVal","type":"uint256"}],"payable":false,"type":"function"},{"inputs":[{"name":"initVal","type":"uint256"}],"type":"constructor"}];
    undefined
    > var public = eth.contract(abi).at("0x1932c48b2bf8102ba33b4a6b545c32236e342f34")
    undefined
    > var private = eth.contract(abi).at("0x1349f3e1b8d71effb47b840594ff27da7e603d17")
    undefined
    > public.get()
    42
    > private.get()
    65535

#### Node 3 geth console

    > var abi = [{"constant":true,"inputs":[],"name":"storedData","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"x","type":"uint256"}],"name":"set","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"get","outputs":[{"name":"retVal","type":"uint256"}],"payable":false,"type":"function"},{"inputs":[{"name":"initVal","type":"uint256"}],"type":"constructor"}];
    undefined
    > var public = eth.contract(abi).at("0x1932c48b2bf8102ba33b4a6b545c32236e342f34")
    undefined
    > var private = eth.contract(abi).at("0x1349f3e1b8d71effb47b840594ff27da7e603d17")
    undefined
    > public.get()
    42
    > private.get()
    0

So, Node 2 is able to see both contracts and the private transaction. Node 3 can see only the public contract and its state.

## Notes

The RPC port for each container is mapped to *localhost* starting from port 22001. So, to see the peers connected to Node 2, you can do either of the following and get the same result. Change it in *setup.sh* if you don't like it.

    curl -X POST --data '{"jsonrpc":"2.0","method":"admin_peers","id":1}' 172.13.0.3:8545
    curl -X POST --data '{"jsonrpc":"2.0","method":"admin_peers","id":1}' localhost:22002

You can see the log files for the nodes in *qdata_N/logs/geth.log* and *qdata_N/logs/constellation.log*.  This is useful when things go wrong!

This example uses only the Raft consensus mechanism.


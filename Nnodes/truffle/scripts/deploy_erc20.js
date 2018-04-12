const compiledToken = require('../build/contracts/CustomToken');
const Web3 = require('web3');
const provider = new Web3.providers.HttpProvider("http://172.13.0.2:8545");
const web3 = new Web3(provider);

const address = "0x5fAA510EB3f838aC398a293b5714ad279f9cECF4";
const privatekey = "0x4646464646464646464646464646464646464646464646464646464646464640";

const bytecode = compiledToken.bytecode;
const contract = new web3.eth.Contract(compiledToken.abi);

deploy = async () => {

  const data = contract.deploy({ data: bytecode, arguments: [] }).encodeABI();
  const transactionObject = {
    gas: "5000000",
    data: data,
    from: address,
    chainId: "10",
  };

  console.log(transactionObject);
  console.log(address);
  console.log(privatekey);

  try {
    const signedTransaction = await web3.eth.accounts.signTransaction(transactionObject, privatekey);
    console.log(signedTransaction);
    const result = await web3.eth.sendSignedTransaction(signedTransaction.rawTransaction);
    console.log(result);
  }
  catch (err) {
    console.log(err);
  }

};
deploy();


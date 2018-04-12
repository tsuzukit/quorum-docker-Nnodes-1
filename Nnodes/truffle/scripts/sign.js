const Web3 = require('web3');
const provider = new Web3.providers.HttpProvider("http://172.13.0.2:8545");
const web3 = new Web3(provider);

deploy = async () => {
  const transactionObject = {
    gasPrice: 20 * 10**9,
    gas: 21000,
    data: "",
    to: "0x3535353535353535353535353535353535353535",
    value: 10**18,
    nonce: 9,
    chainId: 10,
  };

  console.log(transactionObject);
  const signedTransaction = await web3.eth.accounts.signTransaction(transactionObject, "0x4646464646464646464646464646464646464646464646464646464646464649");
  console.log(signedTransaction);

  const recoveredAddress = await web3.eth.accounts.recoverTransaction(signedTransaction.rawTransaction);
  console.log(recoveredAddress);

};
deploy();


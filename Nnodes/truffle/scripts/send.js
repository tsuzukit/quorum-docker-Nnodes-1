const Web3 = require('web3');
const provider = new Web3.providers.HttpProvider("http://172.13.0.2:8545");
const web3 = new Web3(provider);

const address = "0x5fAA510EB3f838aC398a293b5714ad279f9cECF4";
send = async () => {
  const accounts = await web3.eth.getAccounts();
  await web3.eth.personal.unlockAccount(accounts[0], "", 60000);
  let result = await web3.eth.sendTransaction({from: accounts[0], to: address, value: web3.utils.toWei("0.05", "ether")});
  console.log(result);
};
send();



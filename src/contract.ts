import Web3 from "web3";

const abi = require("./comptroller.json");

const COMPTROLLERADDRESS = "0x3d9819210a31b4961b30ef54be2aed79b9c9cd3b";

export async function contract(apiKey: string, walletAdress: string) {
  const web3 = new Web3(new Web3.providers.HttpProvider(`https://mainnet.infura.io/v3/${apiKey}`));
  const contract = new web3.eth.Contract(abi, COMPTROLLERADDRESS);
  console.log(contract.methods);
}

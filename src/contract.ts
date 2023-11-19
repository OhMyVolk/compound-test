import Web3 from "web3";

const CONTRACT_ADDRESS = "0x9c4ec768c28520B50860ea7a15bd7213a9fF58bf";
const CBETH_ADDRESS = "0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22";
const CONTRACT_ABI = require("./abi.json");

export async function contract(apiKey: string, walletAddress: string) {
  const web3 = new Web3(new Web3.providers.HttpProvider(`https://base-mainnet.g.alchemy.com/v2/${apiKey}`));
  const contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
  // @ts-ignore
  const userBasic = await contract.methods.userBasic(walletAddress).call();
  console.log(userBasic);
  // @ts-ignore
  const balanceOf = await contract.methods.balanceOf(walletAddress).call();
  console.log(balanceOf);
  // @ts-ignore
  const getAssetInfoByAddress = await contract.methods.getAssetInfoByAddress(CBETH_ADDRESS).call();
  console.log(getAssetInfoByAddress);
}

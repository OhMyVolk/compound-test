import Web3, { Web3BaseProvider } from "web3";

export function createProvider(apiKey: string): Web3BaseProvider {
  return new Web3.providers.HttpProvider(`https://base-mainnet.g.alchemy.com/v2/${apiKey}`);
}

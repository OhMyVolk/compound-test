import Web3, { Contract, Web3BaseProvider } from "web3";



export class BaseContract {
  abi: any
  address: string
  contract: Contract<any>

  constructor(provider: Web3BaseProvider, abi: any, address: string) {
    const web3 = new Web3(provider);
    this.abi = abi
    this.address = address
    this.contract = new web3.eth.Contract(abi, address);
  }

  async getDecimal(): Promise<number> {
    return Number(await this.contract.methods.decimals().call());
  }

  async getBaseScaleNumber(): Promise<number> {
    return Math.pow(10, await this.getDecimal());
  }
}




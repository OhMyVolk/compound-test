import { ContractAbi, Web3BaseProvider } from "web3";
import { BaseContract } from "./base-contract";

export class AssetContract extends BaseContract {
  constructor(provider: Web3BaseProvider, abi: ContractAbi, address: string) {
    super(provider, abi, address);
  }
}


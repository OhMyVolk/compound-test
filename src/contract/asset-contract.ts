import { Web3BaseProvider } from "web3";
import { BaseContract } from "./base-contract";

export class AssetContract extends BaseContract {
  constructor(provider: Web3BaseProvider, abi: any, address: string) {
    super(provider, abi, address);
  }
}


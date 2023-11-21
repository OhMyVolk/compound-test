import { Web3BaseProvider } from "web3";
import { BaseContract } from "./base-contract";

export class AssetOracleContract extends BaseContract {
  constructor(provider: Web3BaseProvider, abi: any, address: string) {
    super(provider, abi, address);
  }

  async getLatestPrice(): Promise<number> {
    const assetBaseScale: number = await this.getBaseScaleNumber();
    const price = Number(await this.contract.methods.latestAnswer().call())
    return price / assetBaseScale;
  }
}


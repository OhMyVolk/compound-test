import { AssetContract } from "../contract/asset-contract";
import { AssetOracleContract } from "../contract/asset-oracle-contract";
import { CompoundMarketContract } from "../contract/compound-market-contract";
import { createProvider } from "../contract/provider";
import { marketsAbi, assetsAbi, oraclesAbi } from "../contract/abi";

export async function getMarketWalletData(walletAddress: string, marketName: string, assetName: string, oracleName: string) {
  const apiKey: string = process.env.ALCHEMY_API_KEY as string;
  const provider = createProvider(apiKey);
  const marketContract = new CompoundMarketContract(provider, marketsAbi[marketName]["ABI"], marketsAbi[marketName]["address"]);
  const assetContract = new AssetContract(provider, assetsAbi[assetName]["ABI"], assetsAbi[assetName]["address"]);
  const oracleContract = new AssetOracleContract(provider, oraclesAbi[oracleName]["ABI"], oraclesAbi[oracleName]["address"]);
  return marketContract.getAssetData(assetContract, oracleContract, walletAddress);
}

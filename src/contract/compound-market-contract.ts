import { Web3BaseProvider } from "web3";
import { BaseContract } from "./base-contract";
import { AssetContract } from "./asset-contract";
import { AssetOracleContract } from "./asset-oracle-contract";

export class CompoundMarketContract extends BaseContract {
  constructor(provider: Web3BaseProvider, abi: any, address: string) {
    super(provider, abi, address);
  }

  async getAssetData(assetContract: AssetContract, oracleContract: AssetOracleContract, walletAddress: string): Promise<{ [index: string]: number }> {
    const assetBaseScale: number = await assetContract.getBaseScaleNumber();
    const assetAddress = assetContract.address;
    const { collateralFactor, liquidation, liquidationCollateral }: { [index: string]: number } = await this.getAssetInfo(assetBaseScale, assetAddress);
    const totalAssetBalance = await this.getTotalAssetBalance(assetBaseScale, walletAddress, assetAddress, oracleContract);
    const borrowBalance: number = await this.walletBorrowBalance(walletAddress);

    const nominalCCR = ((totalAssetBalance * collateralFactor) / borrowBalance);
    const liquidationCCR = 1 / liquidation;
    const recoveryCCR = 1 / (liquidationCollateral);
    // Temporary
    const marginCCR = recoveryCCR;

    return {
      nominalCCR,
      liquidationCCR,
      recoveryCCR,
      marginCCR,
    }
  }

  async getAssetInfo(assetBaseScale: number, assetAddress: string): Promise<{ [index: string]: number }> {
    // @ts-ignore
    const getAssetInfoByAddress: Any = await this.contract.methods.getAssetInfoByAddress(assetAddress).call();
    const { borrowCollateralFactor, liquidationFactor, liquidateCollateralFactor }: { borrowCollateralFactor: BigInt, liquidationFactor: BigInt, liquidateCollateralFactor: BigInt } = getAssetInfoByAddress;
    const collateralFactor: number = Number(borrowCollateralFactor) / assetBaseScale;
    const liquidation: number = Number(liquidationFactor) / assetBaseScale;
    const liquidationCollateral: number = Number(liquidateCollateralFactor) / assetBaseScale;
    return {
      collateralFactor, liquidation, liquidationCollateral,
    }
  }

  async getTotalAssetBalance(assetBaseScale: number, walletAddress: string, assetAddress: string, oracleContract: AssetOracleContract): Promise<number> {
    const walletCollateralBalance: number = await this.getWalletCollateralBalance(assetBaseScale, walletAddress, assetAddress);
    const assetPrice: number = await oracleContract.getLatestPrice();
    return walletCollateralBalance * assetPrice;
  }

  async getWalletCollateralBalance(assetBaseScale: number, walletAddress: string, assetAddress: string): Promise<number> {
    // @ts-ignore
    const userCollateralBalance = (await this.contract.methods.userCollateral(walletAddress, assetAddress).call()).balance
    return Number(userCollateralBalance) / assetBaseScale;
  }

  async walletBorrowBalance(walletAddress: string): Promise<number> {
    // @ts-ignore
    const borrowBalanceOf = await this.contract.methods.borrowBalanceOf(walletAddress).call();
    const baseScale = await this.getBaseScaleNumber()
    return Number(borrowBalanceOf) / baseScale;
  }
}

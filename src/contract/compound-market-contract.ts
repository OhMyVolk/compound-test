import { ContractAbi, Web3BaseProvider } from "web3";
import { BaseContract } from "./base-contract";
import { AssetContract } from "./asset-contract";
import { AssetOracleContract } from "./asset-oracle-contract";
import { IAssetInfo, IAssetInfoByAddress, IMarketAssetData } from "./interfaces";

export class CompoundMarketContract extends BaseContract {
  constructor(provider: Web3BaseProvider, abi: ContractAbi, address: string) {
    super(provider, abi, address);
  }

  async getAssetData(assetContract: AssetContract, oracleContract: AssetOracleContract, walletAddress: string): Promise<IMarketAssetData> {
    const assetBaseScale: number = await assetContract.getBaseScaleNumber();
    const assetAddress = assetContract.address;
    const { collateralFactor, liquidation, liquidationCollateral }: IAssetInfo = await this.getAssetInfo(assetBaseScale, assetAddress);
    const totalAssetBalance = await this.getTotalAssetBalance(assetBaseScale, walletAddress, assetAddress, oracleContract);
    const borrowBalance: number = await this.walletBorrowBalance(walletAddress);

    const nominalCCR: number = ((totalAssetBalance * collateralFactor) / borrowBalance);
    const liquidationCCR: number = 1 / liquidation;
    const recoveryCCR: number = 1 / (liquidationCollateral);
    // TODO: Temporary
    const marginCCR: number = recoveryCCR;

    return {
      nominalCCR,
      liquidationCCR,
      recoveryCCR,
      marginCCR,
    }
  }

  async getAssetInfo(assetBaseScale: number, assetAddress: string): Promise<IAssetInfo> {
    const getAssetInfoByAddress: IAssetInfoByAddress = await this.contract.methods.getAssetInfoByAddress(assetAddress).call();
    const { borrowCollateralFactor, liquidationFactor, liquidateCollateralFactor } = getAssetInfoByAddress;
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
    const userCollateralBalance = (await this.contract.methods.userCollateral(walletAddress, assetAddress).call()).balance
    return Number(userCollateralBalance) / assetBaseScale;
  }

  async walletBorrowBalance(walletAddress: string): Promise<number> {
    const borrowBalanceOf = await this.contract.methods.borrowBalanceOf(walletAddress).call();
    const baseScale = await this.getBaseScaleNumber()
    return Number(borrowBalanceOf) / baseScale;
  }
}

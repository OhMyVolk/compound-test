export interface IMarketAssetData {
  nominalCCR: number,
  liquidationCCR: number,
  recoveryCCR: number,
  marginCCR: number,
}

export interface IAssetInfo {
  collateralFactor: number,
  liquidation: number,
  liquidationCollateral: number,
}

export interface IAssetInfoByAddress {
  "0": BigInt;
  "1": string;
  "2": string;
  "3": BigInt;
  "4": BigInt;
  "5": BigInt;
  "6": BigInt;
  "7": BigInt;
  __length__: number;
  offset: BigInt;
  asset: string;
  priceFeed: string;
  scale: BigInt;
  borrowCollateralFactor: BigInt;
  liquidateCollateralFactor: BigInt;
  liquidationFactor: BigInt;
  supplyCap: BigInt;
}


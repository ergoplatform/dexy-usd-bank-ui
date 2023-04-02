import { dexyGoldAsset } from '../assets/dexyGoldAsset';
import { AssetInfo } from './AssetInfo';
import { Currency } from './Currency';

export class Balance {
  private mapAssetIdToBalance = new Map<string, Currency>();

  constructor(assetAmount: [bigint, AssetInfo][]) {
    this.mapAssetIdToBalance = new Map(
      assetAmount.map(([amount, info]) => [
        info.id,
        new Currency(amount, info),
      ]),
    );
  }

  get(asset: AssetInfo): Currency {
    const result = this.mapAssetIdToBalance.get(asset.id);

    if (result?.isAssetEquals(dexyGoldAsset)) {
      return new Currency(result.amount, dexyGoldAsset);
    }

    return result || new Currency(0n, asset);
  }

  getById(assetId: string): Currency | undefined {
    return this.mapAssetIdToBalance.get(assetId);
  }

  entries(): [string, Currency][] {
    return Array.from(this.mapAssetIdToBalance.entries());
  }

  values(): Currency[] {
    return Array.from(this.mapAssetIdToBalance.values());
  }
}

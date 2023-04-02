import { DateTime } from 'luxon';

import { AssetInfo } from './AssetInfo';
import { Ratio } from './Ratio';

interface PoolChartDataRaw {
  reservesCount: number;
  timestamp: number;
}

export class PoolChartData {
  // public readonly price: Ratio;
  // public readonly invertedPrice: Ratio;
  public readonly date: DateTime;
  public readonly ts: number;
  public readonly reservesCount: number;

  constructor(private raw: PoolChartDataRaw) {
    this.ts = this.raw.timestamp;
    this.reservesCount = this.raw.reservesCount;
    // this.invertedPrice = this.price.invertRatio();
    this.date = DateTime.fromMillis(this.raw.timestamp);
  }

  // getRatio(isInverted = false): Ratio {
  //   return isInverted ? this.invertedPrice : this.price;
  // }

  clone(raw?: Partial<PoolChartDataRaw>): PoolChartData {
    return new PoolChartData({ ...this.raw, ...raw });
  }
}

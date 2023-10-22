import { DateTime } from 'luxon';

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
    this.date = DateTime.fromMillis(this.raw.timestamp);
  }

  clone(raw?: Partial<PoolChartDataRaw>): PoolChartData {
    return new PoolChartData({ ...this.raw, ...raw });
  }
}

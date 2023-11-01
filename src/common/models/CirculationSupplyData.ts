import { DateTime } from 'luxon';

interface CirculationSupplyDataRaw {
  date: number;
  tokenAmount: number;
}

export class CirculationSupplyData {
  // public readonly price: Ratio;
  // public readonly invertedPrice: Ratio;
  public readonly date: DateTime;
  public readonly ts: number;
  public readonly reservesCount: number;

  constructor(private raw: CirculationSupplyDataRaw) {
    this.ts = this.raw.date;
    this.reservesCount = this.raw.tokenAmount;
    this.date = DateTime.fromMillis(this.raw.date);
  }

  clone(raw?: Partial<CirculationSupplyDataRaw>): CirculationSupplyData {
    return new CirculationSupplyData({ ...this.raw, ...raw });
  }
}

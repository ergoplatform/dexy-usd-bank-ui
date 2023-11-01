import { DateTime } from 'luxon';

interface BankReservesDataRaw {
  date: number;
  value: number;
}

export class BankReservesData {
  // public readonly price: Ratio;
  // public readonly invertedPrice: Ratio;
  public readonly date: DateTime;
  public readonly ts: number;
  public readonly reservesCount: number;

  constructor(private raw: BankReservesDataRaw) {
    this.ts = this.raw.date;
    this.reservesCount = this.raw.value / 1e9;
    this.date = DateTime.fromMillis(this.raw.date);
  }

  clone(raw?: Partial<BankReservesDataRaw>): BankReservesData {
    return new BankReservesData({ ...this.raw, ...raw });
  }
}

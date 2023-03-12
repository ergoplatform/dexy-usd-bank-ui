import { normalizeAmount } from '../utils/amount';
import { getFormatter } from '../utils/createFormatter';
import {
  math,
  parseUserInputToFractions,
  renderFractions,
} from '../utils/math';
import { AssetInfo } from './AssetInfo';
import { Currency } from './Currency';

export class Ratio {
  readonly baseAsset: AssetInfo;

  readonly quoteAsset: AssetInfo;

  readonly amount: bigint;

  private formatter: Intl.NumberFormat;

  private readonly decimals: number;

  private readonly rawAmount: string;

  constructor(amount: string, baseAsset: AssetInfo, quoteAsset: AssetInfo) {
    this.baseAsset = baseAsset;
    this.quoteAsset = quoteAsset;
    this.decimals = this.getRelevantDecimalsCount(amount);
    this.rawAmount = amount;
    this.amount = parseUserInputToFractions(
      Number(amount).toFixed(this.decimals),
      this.decimals,
    );
    this.formatter = Ratio.createFormatter(this.decimals);
  }

  valueOf(): number {
    return Number(this.rawAmount);
  }

  toAbsoluteString(): string {
    return this.formatter.format(
      Math.abs(+renderFractions(this.amount, this.decimals)),
    );
  }

  toString(maxDecimals?: number, minDecimals?: number): string {
    if (maxDecimals !== null && maxDecimals !== undefined) {
      return getFormatter(maxDecimals, minDecimals).format(
        Number(this.rawAmount),
      );
    }

    return this.formatter.format(+renderFractions(this.amount, this.decimals));
  }

  toAmount(): string {
    return renderFractions(this.amount, this.decimals);
  }

  toQuoteCurrency(baseCurrency: Currency): Currency {
    if (baseCurrency.asset.id !== this.baseAsset.id) {
      throw new Error(`Quote currency should be base: ${this.baseAsset.name}`);
    }

    const quoteCurrencyAmount = normalizeAmount(
      math.evaluate!(
        `${baseCurrency.toAmount()} * ${this.invertRatio().rawAmount}`,
      ).toString(),
      this.quoteAsset,
    );

    return new Currency(quoteCurrencyAmount, this.quoteAsset);
  }

  toBaseCurrency(quoteCurrency: Currency): Currency {
    if (quoteCurrency.asset.id !== this.quoteAsset.id) {
      throw new Error(`Base currency should be quote: ${this.quoteAsset.name}`);
    }

    const baseCurrencyAmount = normalizeAmount(
      math.evaluate!(
        `${quoteCurrency.toAmount()} * ${this.rawAmount}`,
      ).toString(),
      this.baseAsset,
    );

    return new Currency(baseCurrencyAmount, this.baseAsset);
  }

  invertRatio(): Ratio {
    return new Ratio(
      math.evaluate!(`1 / ${this.rawAmount}`).toFixed(),
      this.quoteAsset,
      this.baseAsset,
    );
  }

  minus(r: Ratio): Ratio {
    if (
      r.baseAsset.id !== this.baseAsset.id ||
      r.quoteAsset.id !== this.quoteAsset.id
    ) {
      throw new Error('Wrong Ratio assets');
    }
    return new Ratio(
      math.evaluate!(`${this.rawAmount}-${r.rawAmount}`).toFixed(),
      this.baseAsset,
      this.quoteAsset,
    );
  }

  cross(to: Ratio): Ratio {
    if (this.quoteAsset.id !== to.baseAsset.id) {
      throw new Error("can't calculate cross rate with different assets");
    }

    return new Ratio(
      math.evaluate!(`${this.rawAmount} * ${to.rawAmount}`).toFixed(),
      this.baseAsset,
      to.quoteAsset,
    );
  }

  isPositive(): boolean {
    return this.amount > 0n;
  }

  private getRelevantDecimalsCount(amount: string): number {
    const decimalsPart = amount.split('.')[1] || '';

    return Math.max(
      decimalsPart.split('').findIndex((symbol) => Number(symbol) > 0) + 1,
      this.baseAsset.decimals || 0,
    );
  }

  private static createFormatter(decimals: number): Intl.NumberFormat {
    return new Intl.NumberFormat('en-US', {
      maximumFractionDigits: decimals,
      minimumFractionDigits: decimals,
      currencySign: undefined,
      currency: undefined,
    });
  }
}

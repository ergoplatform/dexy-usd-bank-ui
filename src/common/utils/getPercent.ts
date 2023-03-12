const MIN_PERCENT = 0.01;
const MAX_PERCENT = 99.99;
const ZERO_PERCENT = 0;
const TOTAL_PERCENT = 100;

export const getPercent = (current: number, total: number): number => {
  const pct = (current / total) * 100;

  if (pct <= ZERO_PERCENT) {
    return ZERO_PERCENT;
  }
  if (pct >= TOTAL_PERCENT) {
    return TOTAL_PERCENT;
  }
  if (pct < MIN_PERCENT) {
    return MIN_PERCENT;
  }
  if (pct > MAX_PERCENT) {
    return MAX_PERCENT;
  }
  return +pct.toFixed(2);
};

// The rupee sign, written as a code so no editor or font setting can garble it.
export const CURRENCY_SYMBOL = '\u20B9';

// Indian digit grouping: the last three digits, then groups of two. 1234567 -> 12,34,567
function groupIndian(whole: string): string {
  if (whole.length <= 3) {
    return whole;
  }
  const lastThree = whole.slice(-3);
  const rest = whole.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/g, ',');
  return `${rest},${lastThree}`;
}

export function formatMoney(value: number): string {
  const sign = value < 0 ? '-' : '';
  const [whole, fraction] = Math.abs(value).toFixed(2).split('.');
  return `${sign}${CURRENCY_SYMBOL}${groupIndian(whole)}.${fraction}`;
}

export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

function shorten(value: number): string {
  return value >= 10 ? value.toFixed(0) : value.toFixed(1).replace(/\.0$/, '');
}

// Short labels for the chart: 1250 -> "1.3k", 150000 -> "1.5L" (lakh), 25000000 -> "2.5Cr" (crore)
export function formatCompact(value: number): string {
  if (value >= 10_000_000) {
    return `${shorten(value / 10_000_000)}Cr`;
  }
  if (value >= 100_000) {
    return `${shorten(value / 100_000)}L`;
  }
  if (value >= 1000) {
    return `${shorten(value / 1000)}k`;
  }
  return String(Math.round(value));
}

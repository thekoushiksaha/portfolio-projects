export const CURRENCY_SYMBOL = '$';

export function formatMoney(value: number): string {
  const sign = value < 0 ? '-' : '';
  const [whole, fraction] = Math.abs(value).toFixed(2).split('.');
  const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return `${sign}${CURRENCY_SYMBOL}${grouped}.${fraction}`;
}

export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

// 1250 -> "1.3k", used for the small chart labels
export function formatCompact(value: number): string {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(value >= 10000 ? 0 : 1)}k`;
  }
  return String(Math.round(value));
}

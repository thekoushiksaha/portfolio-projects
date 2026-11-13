export function parseAmount(text: string): { value: number | null; error: string | null } {
  const normalized = text.trim().replace(/,/g, '');

  if (!normalized) {
    return { value: null, error: 'Enter an amount' };
  }
  if (!/^\d{1,10}(\.\d{1,2})?$/.test(normalized)) {
    return { value: null, error: 'Use numbers only, with up to 2 decimals' };
  }
  const value = Number(normalized);
  if (value < 0.01) {
    return { value: null, error: 'Amount must be at least 0.01' };
  }
  return { value, error: null };
}

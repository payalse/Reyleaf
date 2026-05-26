const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: '$',
  INR: '₹',
  GBP: '£',
  EUR: '€',
};

export function formatMoney(cents: number, currency = 'USD'): string {
  const symbol = CURRENCY_SYMBOLS[currency] ?? currency;
  return `${symbol}${(cents / 100).toFixed(2)}`;
}

export function centsToAmount(cents: number): string {
  return (cents / 100).toFixed(2);
}

export function amountToCents(amount: string | number): number {
  return Math.round(parseFloat(String(amount)) * 100);
}

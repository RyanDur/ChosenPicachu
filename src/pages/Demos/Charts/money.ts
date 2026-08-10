export const dollars = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0
});

export const cents = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD'
});

const btc = new Intl.NumberFormat('en-US', {maximumSignificantDigits: 3});

export const bitcoin = (size: number): string => `${btc.format(size)} BTC`;

export const deltaLabel = (first: number, last: number): string =>
  `${last < first ? '-' : '+'}${cents.format(Math.abs(last - first))}`;

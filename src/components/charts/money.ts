export const dollars = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0
});

export const cents = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD'
});

export const deltaLabel = (first: number, last: number): string =>
  `${last < first ? '-' : '+'}${cents.format(Math.abs(last - first))}`;

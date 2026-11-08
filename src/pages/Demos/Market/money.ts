const dollars = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0
});

const cents = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD'
});

const bitcoinFormat = new Intl.NumberFormat('en-US', {maximumSignificantDigits: 3});

const bitcoin = (size: number): string => `${bitcoinFormat.format(size)} BTC`;

const deltaLabel = (first: number, last: number): string =>
  `${last < first ? '-' : '+'}${cents.format(Math.abs(last - first))}`;

type Money = {
  dollars: Intl.NumberFormat;
  cents: Intl.NumberFormat;
  bitcoin: (size: number) => string;
  deltaLabel: (first: number, last: number) => string;
};

export const money: Money = {dollars, cents, bitcoin, deltaLabel};

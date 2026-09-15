export const columnShares = (window: number, trades: number): Readonly<Record<string, number>> =>
  ({window, trades, buys: 100 - window - trades});

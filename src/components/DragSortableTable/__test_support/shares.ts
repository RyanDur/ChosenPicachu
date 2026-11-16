export const columnShares = (windowShare: number, trades: number): Readonly<Record<string, number>> =>
  ({window: windowShare, trades, buys: 100 - windowShare - trades});

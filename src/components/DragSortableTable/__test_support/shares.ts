export const columnShares = (lookbackShare: number, tradesShare: number): Readonly<Record<string, number>> =>
  ({lookback: lookbackShare, trades: tradesShare, buys: 100 - lookbackShare - tradesShare});

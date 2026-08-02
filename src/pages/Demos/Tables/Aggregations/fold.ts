import {format} from 'date-fns';
import {Trade} from '../../Charts/coinbase';
import {cents, deltaLabel} from '../../Charts/money';

export type AggregateRow = {
  time: string;
  trades: string;
  buys: string;
  sells: string;
  volume: string;
  vwap: string;
  change: string;
};

const MINUTE = 60000;

const aggregate = (openedAt: number, trades: readonly Trade[]): AggregateRow => {
  const volume = trades.reduce((total, trade) => total + trade.size, 0);
  const notional = trades.reduce((total, trade) => total + trade.size * trade.price, 0);
  const buys = trades.filter(trade => trade.side === 'buy').length;
  return {
    time: format(openedAt, 'HH:mm'),
    trades: String(trades.length),
    buys: String(buys),
    sells: String(trades.length - buys),
    volume: volume.toFixed(2),
    vwap: cents.format(notional / volume),
    change: deltaLabel(trades[0].price, trades[trades.length - 1].price)
  };
};

export const aggregatedMinutes = (trades: readonly Trade[]): readonly AggregateRow[] => {
  const byMinute = new Map<number, Trade[]>();
  for (const trade of trades) {
    const openedAt = Math.floor(trade.tradedAt / MINUTE) * MINUTE;
    byMinute.set(openedAt, [...byMinute.get(openedAt) ?? [], trade]);
  }
  return [...byMinute.entries()]
    .sort(([left], [right]) => right - left)
    .map(([openedAt, bucket]) => aggregate(openedAt, bucket));
};

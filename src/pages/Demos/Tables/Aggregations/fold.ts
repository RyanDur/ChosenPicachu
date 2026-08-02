import {has} from '@ryandur/sand';
import {Trade} from '../../Charts/coinbase';
import {cents, deltaLabel} from '../../Charts/money';

export type AggregateRow = {
  window: string;
  trades: string;
  buys: string;
  sells: string;
  volume: string;
  vwap: string;
  change: string;
};

const MINUTE = 60000;

export const windows = [
  {label: 'this minute', span: MINUTE},
  {label: 'last 5 minutes', span: 5 * MINUTE},
  {label: 'last 15 minutes', span: 15 * MINUTE},
  {label: 'this hour', span: 60 * MINUTE},
  {label: 'session', span: Number.POSITIVE_INFINITY}
];

const still = (label: string): AggregateRow =>
  ({window: label, trades: '0', buys: '0', sells: '0', volume: '0.00', vwap: '—', change: '—'});

const aggregate = (label: string, trades: readonly Trade[]): AggregateRow => {
  if (trades.length === 0) {
    return still(label);
  }
  const volume = trades.reduce((total, trade) => total + trade.size, 0);
  const notional = trades.reduce((total, trade) => total + trade.size * trade.price, 0);
  const buys = trades.filter(trade => trade.side === 'buy').length;
  return {
    window: label,
    trades: String(trades.length),
    buys: String(buys),
    sells: String(trades.length - buys),
    volume: volume.toFixed(2),
    vwap: cents.format(notional / volume),
    change: deltaLabel(trades[0].price, trades[trades.length - 1].price)
  };
};

export const windowedAggregates = (trades: readonly Trade[]): readonly AggregateRow[] => {
  const now = trades[trades.length - 1]?.tradedAt;
  return windows.map(({label, span}) =>
    aggregate(label, trades.filter(trade => has(now) && now - trade.tradedAt < span)));
};

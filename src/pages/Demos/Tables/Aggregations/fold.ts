import {Trade} from '../../Charts/coinbase';

export type WindowAggregate = {
  window: string;
  span: number;
  trades: number;
  buys: number;
  sells: number;
  volume: number;
  vwap: number | undefined;
  opened: number | undefined;
  closed: number | undefined;
};

const MINUTE = 60000;

export const windows = [
  {label: 'this minute', span: MINUTE},
  {label: 'last 5 minutes', span: 5 * MINUTE},
  {label: 'last 15 minutes', span: 15 * MINUTE},
  {label: 'this hour', span: 60 * MINUTE},
  {label: 'session', span: Number.POSITIVE_INFINITY}
];

const still = (label: string, span: number): WindowAggregate =>
  ({window: label, span, trades: 0, buys: 0, sells: 0, volume: 0, vwap: undefined, opened: undefined, closed: undefined});

const aggregate = (label: string, span: number, trades: readonly Trade[]): WindowAggregate => {
  if (trades.length === 0) {
    return still(label, span);
  }
  const volume = trades.reduce((total, trade) => total + trade.size, 0);
  const notional = trades.reduce((total, trade) => total + trade.size * trade.price, 0);
  const buys = trades.filter(trade => trade.side === 'buy').length;
  return {
    window: label,
    span,
    trades: trades.length,
    buys,
    sells: trades.length - buys,
    volume,
    vwap: notional / volume,
    opened: trades[0].price,
    closed: trades[trades.length - 1].price
  };
};

export const windowedAggregates = (trades: readonly Trade[]): readonly WindowAggregate[] => {
  const now = trades[trades.length - 1]?.tradedAt;
  return windows.map(({label, span}) =>
    aggregate(label, span, trades.filter(trade => now !== undefined && now - trade.tradedAt < span)));
};

import {Trade} from './coinbase';
import {maybe, empty} from '@ryandur/sand';

export type Traded = {
  vwap: number;
  opened: number;
  closed: number;
};

export type LookbackTotals = {
  label: string;
  milliseconds: number;
  trades: number;
  buys: number;
  sells: number;
  volume: number;
  traded?: Traded;
};

const MINUTE = 60000;

const lookbacks = [
  {label: 'this minute', milliseconds: MINUTE},
  {label: 'last 5 minutes', milliseconds: 5 * MINUTE},
  {label: 'last 15 minutes', milliseconds: 15 * MINUTE},
  {label: 'this hour', milliseconds: 60 * MINUTE},
  {label: 'session', milliseconds: Number.POSITIVE_INFINITY}
];

const still = (label: string, milliseconds: number): LookbackTotals =>
  ({label, milliseconds, trades: 0, buys: 0, sells: 0, volume: 0});

const aggregate = (label: string, milliseconds: number, trades: readonly Trade[]): LookbackTotals => {
  if (empty(trades)) {
    return still(label, milliseconds);
  }
  const volume = trades.reduce((total, trade) => total + trade.size, 0);
  const notional = trades.reduce((total, trade) => total + trade.size * trade.price, 0);
  const buys = trades.filter(trade => trade.takerSide === 'buy').length;
  return {
    label,
    milliseconds,
    trades: trades.length,
    buys,
    sells: trades.length - buys,
    volume,
    traded: {
      vwap: notional / volume,
      opened: trades[0].price,
      closed: trades[trades.length - 1].price
    }
  };
};

const perLookback = (trades: readonly Trade[]): readonly LookbackTotals[] =>
  lookbacks.map(({label, milliseconds}) => aggregate(label, milliseconds, maybe(trades[trades.length - 1])
    .map(({tradedAt: now}) => trades.filter(trade => now - trade.tradedAt < milliseconds))
    .orElse([])));

type TradeTotals = {
  lookbacks: readonly {label: string; milliseconds: number}[];
  perLookback: (trades: readonly Trade[]) => readonly LookbackTotals[];
};

export const tradeTotals: TradeTotals = {lookbacks, perLookback};

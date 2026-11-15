import {Trade} from './coinbase';
import {maybe, empty} from '@ryandur/sand';

export type Traded = {
  vwap: number;
  opened: number;
  closed: number;
};

export type Lookback = 'minute' | 'five-minutes' | 'fifteen-minutes' | 'hour' | 'session';

type NamedLookback = {
  lookback: Lookback;
  name: string;
  milliseconds: number;
};

export type LookbackTotals = NamedLookback & {
  trades: number;
  buys: number;
  sells: number;
  volume: number;
  traded?: Traded;
};

const MINUTE = 60000;

const lookbacks = [
  {lookback: 'minute', name: 'this minute', milliseconds: MINUTE},
  {lookback: 'five-minutes', name: 'last 5 minutes', milliseconds: 5 * MINUTE},
  {lookback: 'fifteen-minutes', name: 'last 15 minutes', milliseconds: 15 * MINUTE},
  {lookback: 'hour', name: 'this hour', milliseconds: 60 * MINUTE},
  {lookback: 'session', name: 'session', milliseconds: Number.POSITIVE_INFINITY}
] satisfies readonly NamedLookback[];

const still = (named: NamedLookback): LookbackTotals =>
  ({...named, trades: 0, buys: 0, sells: 0, volume: 0});

const aggregate = (named: NamedLookback, trades: readonly Trade[]): LookbackTotals => {
  if (empty(trades)) {
    return still(named);
  }
  const volume = trades.reduce((total, trade) => total + trade.size, 0);
  const notional = trades.reduce((total, trade) => total + trade.size * trade.price, 0);
  const buys = trades.filter(trade => trade.takerSide === 'buy').length;
  return {
    ...named,
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
  lookbacks.map(named => aggregate(named, maybe(trades[trades.length - 1])
    .map(({tradedAt: now}) => trades.filter(trade => now - trade.tradedAt < named.milliseconds))
    .orElse([])));

type TradeTotals = {
  lookbacks: readonly NamedLookback[];
  perLookback: (trades: readonly Trade[]) => readonly LookbackTotals[];
};

export const tradeTotals: TradeTotals = {lookbacks, perLookback};

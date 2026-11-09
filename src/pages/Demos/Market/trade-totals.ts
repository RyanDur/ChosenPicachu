import {Trade} from './coinbase';
import {maybe, empty} from '@ryandur/sand';

export type Traded = {
  vwap: number;
  opened: number;
  closed: number;
};

export type Lookback = 'minute' | 'five-minutes' | 'fifteen-minutes' | 'hour' | 'session';

type LookbackSpan = {
  lookback: Lookback;
  name: string;
  milliseconds: number;
};

export type LookbackTotals = LookbackSpan & {
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
] satisfies readonly LookbackSpan[];

const still = (span: LookbackSpan): LookbackTotals =>
  ({...span, trades: 0, buys: 0, sells: 0, volume: 0});

const aggregate = (span: LookbackSpan, trades: readonly Trade[]): LookbackTotals => {
  if (empty(trades)) {
    return still(span);
  }
  const volume = trades.reduce((total, trade) => total + trade.size, 0);
  const notional = trades.reduce((total, trade) => total + trade.size * trade.price, 0);
  const buys = trades.filter(trade => trade.takerSide === 'buy').length;
  return {
    ...span,
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
  lookbacks.map(span => aggregate(span, maybe(trades[trades.length - 1])
    .map(({tradedAt: now}) => trades.filter(trade => now - trade.tradedAt < span.milliseconds))
    .orElse([])));

type TradeTotals = {
  lookbacks: readonly LookbackSpan[];
  perLookback: (trades: readonly Trade[]) => readonly LookbackTotals[];
};

export const tradeTotals: TradeTotals = {lookbacks, perLookback};

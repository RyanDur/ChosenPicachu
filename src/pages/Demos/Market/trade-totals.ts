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

const held = 60 * MINUTE;

type OpenAndClose = {
  opened: number;
  closed: number;
};

export type Tally = {
  trades: number;
  buys: number;
  sells: number;
  volume: number;
  notional: number;
  openAndClose?: OpenAndClose;
};

const noTally: Tally = {trades: 0, buys: 0, sells: 0, volume: 0, notional: 0};

const tallied = (trades: readonly Trade[]): Tally => {
  if (empty(trades)) {
    return noTally;
  }
  const buys = trades.filter(trade => trade.takerSide === 'buy').length;
  return {
    trades: trades.length,
    buys,
    sells: trades.length - buys,
    volume: trades.reduce((total, trade) => total + trade.size, 0),
    notional: trades.reduce((total, trade) => total + trade.size * trade.price, 0),
    openAndClose: {opened: trades[0].price, closed: trades[trades.length - 1].price}
  };
};

const joined = (earlier: Tally, later: Tally): Tally => ({
  trades: earlier.trades + later.trades,
  buys: earlier.buys + later.buys,
  sells: earlier.sells + later.sells,
  volume: earlier.volume + later.volume,
  notional: earlier.notional + later.notional,
  openAndClose: maybe(earlier.openAndClose).either(
    before => ({
      opened: before.opened,
      closed: maybe(later.openAndClose).map(after => after.closed).orElse(before.closed)
    }),
    () => later.openAndClose)
});

const totalsOf = (
  lookback: NamedLookback,
  {trades, buys, sells, volume, notional, openAndClose}: Tally
): LookbackTotals => {
  const counted = {...lookback, trades, buys, sells, volume};
  return maybe(openAndClose).either(
    ({opened, closed}) => ({...counted, traded: {vwap: notional / volume, opened, closed}}),
    () => counted);
};

const perLookback = (trades: readonly Trade[], agedOut: Tally = noTally): readonly LookbackTotals[] =>
  lookbacks.map(lookback => {
    const inside = maybe(trades[trades.length - 1])
      .map(({tradedAt: now}) => trades.filter(trade => now - trade.tradedAt < lookback.milliseconds))
      .orElse([]);
    return totalsOf(lookback, lookback.milliseconds > held ? joined(agedOut, tallied(inside)) : tallied(inside));
  });

type TradeTotals = {
  lookbacks: readonly NamedLookback[];
  held: number;
  noTally: Tally;
  tallied: (trades: readonly Trade[]) => Tally;
  joined: (earlier: Tally, later: Tally) => Tally;
  perLookback: (trades: readonly Trade[], agedOut?: Tally) => readonly LookbackTotals[];
};

export const tradeTotals: TradeTotals = {lookbacks, held, noTally, tallied, joined, perLookback};

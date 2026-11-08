import {Candle} from './candles';

export type PeriodHistory =
  | {state: 'loading'}
  | {state: 'unavailable'}
  | {state: 'arrived'; candles: readonly Candle[]};

const candlesOf = (history: PeriodHistory): readonly Candle[] =>
  history.state === 'arrived' ? history.candles : [];

type PeriodHistories = {
  loading: PeriodHistory;
  unavailable: PeriodHistory;
  candlesOf: (history: PeriodHistory) => readonly Candle[];
};

export const periodHistory: PeriodHistories = {loading: {state: 'loading'}, unavailable: {state: 'unavailable'}, candlesOf};

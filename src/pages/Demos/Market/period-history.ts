import {Candle} from './candles';

export type PeriodHistory =
  | {state: 'unasked'}
  | {state: 'loading'}
  | {state: 'unavailable'}
  | {state: 'arrived'; candles: readonly Candle[]};

const candlesOf = (history: PeriodHistory): readonly Candle[] =>
  history.state === 'arrived' ? history.candles : [];

const stillComing = (history: PeriodHistory): boolean =>
  history.state === 'unasked' || history.state === 'loading';

type PeriodHistories = {
  unasked: PeriodHistory;
  loading: PeriodHistory;
  unavailable: PeriodHistory;
  candlesOf: (history: PeriodHistory) => readonly Candle[];
  stillComing: (history: PeriodHistory) => boolean;
};

export const periodHistory: PeriodHistories = {
  unasked: {state: 'unasked'},
  loading: {state: 'loading'},
  unavailable: {state: 'unavailable'},
  candlesOf,
  stillComing
};

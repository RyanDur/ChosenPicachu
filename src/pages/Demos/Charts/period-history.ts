import {Candle} from './Candles/shapes';
import {bucketLabel, Period} from './period';

export type PeriodHistory =
  | {state: 'loading'}
  | {state: 'unavailable'}
  | {state: 'arrived'; candles: readonly Candle[]};

export const loading: PeriodHistory = {state: 'loading'};
export const unavailable: PeriodHistory = {state: 'unavailable'};

export const candlesOf = (history: PeriodHistory): readonly Candle[] =>
  history.state === 'arrived' ? history.candles : [];

export const captionFor = (history: PeriodHistory, candles: number, period: Period): string => {
  if (candles > 0) return `${candles} candles · ${bucketLabel[period]}`;
  switch (history.state) {
    case 'loading':
      return 'loading history';
    case 'unavailable':
      return 'history unavailable';
    case 'arrived':
      return 'waiting for the first trade';
  }
};

import {Period, PeriodHistory} from '../Market';
import {periodDisplay} from './period-display';

export const captionFor = (history: PeriodHistory, candles: number, period: Period): string => {
  if (candles > 0) return `${candles} ${candles === 1 ? 'candle' : 'candles'} · ${periodDisplay.bucketLabel[period]}`;
  switch (history.state) {
    case 'loading':
      return 'loading history';
    case 'unavailable':
      return 'history unavailable';
    case 'arrived':
      return 'waiting for the first trade';
  }
};

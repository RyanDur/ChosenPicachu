export enum Period {
  live = 'live',
  hour = 'hour',
  day = 'day',
  week = 'week',
}

export type HistoryPeriod = Exclude<Period, Period.live>;

export const granularitySeconds: Record<HistoryPeriod, number> = {
  [Period.hour]: 60,
  [Period.day]: 3600,
  [Period.week]: 21600
};

export const bucketLabel: Record<HistoryPeriod, string> = {
  [Period.hour]: '1m each',
  [Period.day]: '1h each',
  [Period.week]: '6h each'
};

export const timePattern: Record<Period, string> = {
  [Period.live]: 'HH:mm',
  [Period.hour]: 'HH:mm',
  [Period.day]: 'HH:mm',
  [Period.week]: 'MMM d'
};

export const tickIntervalMs: Record<HistoryPeriod, number> = {
  [Period.hour]: 600000,
  [Period.day]: 3600000,
  [Period.week]: 86400000
};

export type DateRange = {
  from: string;
  to: string;
};

export type ChartWindow = Period | DateRange;

export const isRange = (chartWindow: ChartWindow): chartWindow is DateRange =>
  typeof chartWindow === 'object';

const GRANULARITY_LADDER: readonly number[] = [60, 300, 900, 3600, 21600, 86400];
const CANDLE_CAP = 300;
const DAY_MS = 86400000;

export const startOf = (day: string): Date => new Date(`${day}T00:00:00`);
export const endOf = (day: string): Date => new Date(startOf(day).getTime() + DAY_MS);

const rangeSpanSeconds = (range: DateRange): number =>
  (endOf(range.to).getTime() - startOf(range.from).getTime()) / 1000;

export const rangeGranularity = (range: DateRange): number => {
  const span = rangeSpanSeconds(range);
  return GRANULARITY_LADDER.find(seconds => span / seconds <= CANDLE_CAP) ?? DAY_MS / 1000;
};

export const granularityLabel: Record<number, string> = {
  60: '1m each',
  300: '5m each',
  900: '15m each',
  3600: '1h each',
  21600: '6h each',
  86400: '1d each'
};

const rangeTickEvery = (range: DateRange): number => {
  const spanMs = rangeSpanSeconds(range) * 1000;
  if (spanMs <= 7200000) {
    return 600000;
  }
  return spanMs <= 172800000 ? 3600000 : DAY_MS;
};

export const windowTickEvery = (chartWindow: ChartWindow): number => {
  if (isRange(chartWindow)) {
    return rangeTickEvery(chartWindow);
  }
  return chartWindow === Period.live ? 600000 : tickIntervalMs[chartWindow];
};

export const windowPattern = (chartWindow: ChartWindow): string =>
  isRange(chartWindow)
    ? (rangeTickEvery(chartWindow) < DAY_MS ? 'HH:mm' : 'MMM d')
    : timePattern[chartWindow];

export const windowBucketLabel = (chartWindow: ChartWindow): string => {
  if (isRange(chartWindow)) {
    return granularityLabel[rangeGranularity(chartWindow)];
  }
  return chartWindow === Period.live ? '1m each' : bucketLabel[chartWindow];
};

export const windowBucketMs = (chartWindow: ChartWindow): number => {
  if (isRange(chartWindow)) {
    return rangeGranularity(chartWindow) * 1000;
  }
  return chartWindow === Period.live ? 60000 : granularitySeconds[chartWindow] * 1000;
};

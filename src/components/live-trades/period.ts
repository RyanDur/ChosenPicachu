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
  [Period.live]: 'HH:mm:ss',
  [Period.hour]: 'HH:mm',
  [Period.day]: 'HH:mm',
  [Period.week]: 'MMM d'
};

export const tickIntervalMs: Record<HistoryPeriod, number> = {
  [Period.hour]: 600000,
  [Period.day]: 3600000,
  [Period.week]: 86400000
};

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

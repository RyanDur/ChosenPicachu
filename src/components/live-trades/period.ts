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

export const periodSpanMs: Record<HistoryPeriod, number> = {
  [Period.hour]: 3600000,
  [Period.day]: 86400000,
  [Period.week]: 604800000
};

export const bucketLabel: Record<Period, string> = {
  [Period.live]: '1m each',
  [Period.hour]: '1m each',
  [Period.day]: '1h each',
  [Period.week]: '6h each'
};

export const bucketMs: Record<Period, number> = {
  [Period.live]: 60000,
  [Period.hour]: 60000,
  [Period.day]: 3600000,
  [Period.week]: 21600000
};

export const tickEveryMs: Record<Period, number> = {
  [Period.live]: 600000,
  [Period.hour]: 600000,
  [Period.day]: 3600000,
  [Period.week]: 86400000
};

export const timePattern: Record<Period, string> = {
  [Period.live]: 'HH:mm',
  [Period.hour]: 'HH:mm',
  [Period.day]: 'HH:mm',
  [Period.week]: 'MMM d'
};

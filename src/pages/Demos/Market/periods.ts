import {Period} from './Period';

const granularitySeconds: Record<Period, number> = {
  [Period.hour]: 60,
  [Period.day]: 3600,
  [Period.week]: 21600
};

const spanMilliseconds: Record<Period, number> = {
  [Period.hour]: 3600000,
  [Period.day]: 86400000,
  [Period.week]: 604800000
};

const bucketMilliseconds: Record<Period, number> = {
  [Period.hour]: 60000,
  [Period.day]: 3600000,
  [Period.week]: 21600000
};

const candleCap: Record<Period, number> = {
  [Period.hour]: 60,
  [Period.day]: 24,
  [Period.week]: 28
};

type Periods = {
  granularitySeconds: Record<Period, number>;
  spanMilliseconds: Record<Period, number>;
  bucketMilliseconds: Record<Period, number>;
  candleCap: Record<Period, number>;
};

export const periods: Periods = {granularitySeconds, spanMilliseconds, bucketMilliseconds, candleCap};

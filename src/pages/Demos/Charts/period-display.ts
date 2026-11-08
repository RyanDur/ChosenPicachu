import {Period} from '../Market';

const bucketLabel: Record<Period, string> = {
  [Period.hour]: '1m each',
  [Period.day]: '1h each',
  [Period.week]: '6h each'
};

const tickEveryMilliseconds: Record<Period, number> = {
  [Period.hour]: 600000,
  [Period.day]: 3600000,
  [Period.week]: 86400000
};

const timePattern: Record<Period, string> = {
  [Period.hour]: 'HH:mm',
  [Period.day]: 'HH:mm',
  [Period.week]: 'MMM d'
};

export const periodDisplay = {bucketLabel, tickEveryMilliseconds, timePattern};

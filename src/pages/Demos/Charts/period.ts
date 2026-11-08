import {Period} from '../Market';

export const bucketLabel: Record<Period, string> = {
  [Period.hour]: '1m each',
  [Period.day]: '1h each',
  [Period.week]: '6h each'
};

export const tickEveryMs: Record<Period, number> = {
  [Period.hour]: 600000,
  [Period.day]: 3600000,
  [Period.week]: 86400000
};

export const timePattern: Record<Period, string> = {
  [Period.hour]: 'HH:mm',
  [Period.day]: 'HH:mm',
  [Period.week]: 'MMM d'
};

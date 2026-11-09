import {Period, periods} from '../Market';

const minuteMilliseconds = 60000;
const hourMilliseconds = 3600000;

const bucketLabelOf = (period: Period): string => {
  const bucket = periods.bucketMilliseconds[period];
  return bucket < hourMilliseconds ? `${bucket / minuteMilliseconds}m each` : `${bucket / hourMilliseconds}h each`;
};

const bucketLabel: Record<Period, string> = {
  [Period.hour]: bucketLabelOf(Period.hour),
  [Period.day]: bucketLabelOf(Period.day),
  [Period.week]: bucketLabelOf(Period.week)
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

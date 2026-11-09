import {millisecondsInDay, millisecondsInHour, millisecondsInMinute} from 'date-fns/constants';
import {Period, periods} from '../Market';

const bucketLabelOf = (period: Period): string => {
  const bucketMilliseconds = periods.bucketMilliseconds[period];
  return bucketMilliseconds < millisecondsInHour
    ? `${bucketMilliseconds / millisecondsInMinute}m each`
    : `${bucketMilliseconds / millisecondsInHour}h each`;
};

const bucketLabel: Record<Period, string> = {
  [Period.hour]: bucketLabelOf(Period.hour),
  [Period.day]: bucketLabelOf(Period.day),
  [Period.week]: bucketLabelOf(Period.week)
};

const tickEveryMilliseconds: Record<Period, number> = {
  [Period.hour]: 10 * millisecondsInMinute,
  [Period.day]: millisecondsInHour,
  [Period.week]: millisecondsInDay
};

const timePattern: Record<Period, string> = {
  [Period.hour]: 'HH:mm',
  [Period.day]: 'HH:mm',
  [Period.week]: 'MMM d'
};

export const periodDisplay = {bucketLabel, tickEveryMilliseconds, timePattern};

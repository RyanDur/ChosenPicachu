import {
  millisecondsInDay,
  millisecondsInHour,
  millisecondsInSecond,
  millisecondsInWeek,
  secondsInHour,
  secondsInMinute
} from 'date-fns/constants';
import {Period} from './Period';

type Lengths = {
  readonly bucketSeconds: number;
  readonly lengthMilliseconds: number;
};

const lengthsByPeriod: Record<Period, Lengths> = {
  [Period.hour]: {bucketSeconds: secondsInMinute, lengthMilliseconds: millisecondsInHour},
  [Period.day]: {bucketSeconds: secondsInHour, lengthMilliseconds: millisecondsInDay},
  [Period.week]: {bucketSeconds: 6 * secondsInHour, lengthMilliseconds: millisecondsInWeek}
};

const perPeriod = (fromLengths: (lengths: Lengths) => number): Record<Period, number> => ({
  [Period.hour]: fromLengths(lengthsByPeriod[Period.hour]),
  [Period.day]: fromLengths(lengthsByPeriod[Period.day]),
  [Period.week]: fromLengths(lengthsByPeriod[Period.week])
});

const bucketSeconds = perPeriod(lengths => lengths.bucketSeconds);

const lengthMilliseconds = perPeriod(lengths => lengths.lengthMilliseconds);

const bucketMilliseconds = perPeriod(lengths => lengths.bucketSeconds * millisecondsInSecond);

const candleCap = perPeriod(lengths => lengths.lengthMilliseconds / (lengths.bucketSeconds * millisecondsInSecond));

type Periods = {
  bucketSeconds: Record<Period, number>;
  lengthMilliseconds: Record<Period, number>;
  bucketMilliseconds: Record<Period, number>;
  candleCap: Record<Period, number>;
};

export const periods: Periods = {bucketSeconds, lengthMilliseconds, bucketMilliseconds, candleCap};

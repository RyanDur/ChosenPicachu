import {Period} from './Period';

type Lengths = {
  readonly bucketSeconds: number;
  readonly lengthMilliseconds: number;
};

const lengthsByPeriod: Record<Period, Lengths> = {
  [Period.hour]: {bucketSeconds: 60, lengthMilliseconds: 3600000},
  [Period.day]: {bucketSeconds: 3600, lengthMilliseconds: 86400000},
  [Period.week]: {bucketSeconds: 21600, lengthMilliseconds: 604800000}
};

const perPeriod = (fromLengths: (lengths: Lengths) => number): Record<Period, number> => ({
  [Period.hour]: fromLengths(lengthsByPeriod[Period.hour]),
  [Period.day]: fromLengths(lengthsByPeriod[Period.day]),
  [Period.week]: fromLengths(lengthsByPeriod[Period.week])
});

const bucketSeconds = perPeriod(lengths => lengths.bucketSeconds);

const lengthMilliseconds = perPeriod(lengths => lengths.lengthMilliseconds);

const bucketMilliseconds = perPeriod(lengths => lengths.bucketSeconds * 1000);

const candleCap = perPeriod(lengths => lengths.lengthMilliseconds / (lengths.bucketSeconds * 1000));

type Periods = {
  bucketSeconds: Record<Period, number>;
  lengthMilliseconds: Record<Period, number>;
  bucketMilliseconds: Record<Period, number>;
  candleCap: Record<Period, number>;
};

export const periods: Periods = {bucketSeconds, lengthMilliseconds, bucketMilliseconds, candleCap};

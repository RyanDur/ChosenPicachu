import {Period} from './Period';

type Lengths = {
  readonly granularitySeconds: number;
  readonly spanMilliseconds: number;
};

const lengths: Record<Period, Lengths> = {
  [Period.hour]: {granularitySeconds: 60, spanMilliseconds: 3600000},
  [Period.day]: {granularitySeconds: 3600, spanMilliseconds: 86400000},
  [Period.week]: {granularitySeconds: 21600, spanMilliseconds: 604800000}
};

const perPeriod = (valueOf: (lengths: Lengths) => number): Record<Period, number> => ({
  [Period.hour]: valueOf(lengths[Period.hour]),
  [Period.day]: valueOf(lengths[Period.day]),
  [Period.week]: valueOf(lengths[Period.week])
});

const granularitySeconds = perPeriod(lengths => lengths.granularitySeconds);

const spanMilliseconds = perPeriod(lengths => lengths.spanMilliseconds);

const bucketMilliseconds = perPeriod(lengths => lengths.granularitySeconds * 1000);

const candleCap = perPeriod(lengths => lengths.spanMilliseconds / (lengths.granularitySeconds * 1000));

type Periods = {
  granularitySeconds: Record<Period, number>;
  spanMilliseconds: Record<Period, number>;
  bucketMilliseconds: Record<Period, number>;
  candleCap: Record<Period, number>;
};

export const periods: Periods = {granularitySeconds, spanMilliseconds, bucketMilliseconds, candleCap};

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

const each = (read: (period: Lengths) => number): Record<Period, number> => ({
  [Period.hour]: read(lengths[Period.hour]),
  [Period.day]: read(lengths[Period.day]),
  [Period.week]: read(lengths[Period.week])
});

const granularitySeconds = each(period => period.granularitySeconds);

const spanMilliseconds = each(period => period.spanMilliseconds);

const bucketMilliseconds = each(period => period.granularitySeconds * 1000);

const candleCap = each(period => period.spanMilliseconds / (period.granularitySeconds * 1000));

type Periods = {
  granularitySeconds: Record<Period, number>;
  spanMilliseconds: Record<Period, number>;
  bucketMilliseconds: Record<Period, number>;
  candleCap: Record<Period, number>;
};

export const periods: Periods = {granularitySeconds, spanMilliseconds, bucketMilliseconds, candleCap};

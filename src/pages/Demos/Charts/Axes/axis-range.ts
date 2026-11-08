import {Maybe, maybe} from '@ryandur/sand';

export type AxisExtent = {high: number; low: number; times: readonly [number, ...number[]]};

const of = (times: readonly number[], high: number, low: number): Maybe<AxisExtent> => {
  const [first, ...rest] = times;
  return maybe(first).map(at => ({high, low, times: [at, ...rest]}));
};

export const axisRange = {of};

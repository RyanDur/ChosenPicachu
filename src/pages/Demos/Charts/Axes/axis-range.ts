import {Maybe, maybe} from '@ryandur/sand';

export type Range = {high: number; low: number; times: readonly [number, ...number[]]};

const of = (times: readonly number[], high: number, low: number): Maybe<Range> => {
  const [first, ...rest] = times;
  return maybe(first).map(at => ({high, low, times: [at, ...rest]}));
};

export const axisRange = {of};

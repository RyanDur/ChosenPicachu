import {matchOn} from '@ryandur/sand';

export type ChartKind = 'price' | 'candles' | 'pressure' | 'pie';

const all: readonly ChartKind[] = ['price', 'candles', 'pressure', 'pie'];

const is = (kind: string | undefined): kind is ChartKind =>
  all.some(candidate => candidate === kind);

const match = matchOn([...all]);

export const chartKinds = {all, is, match};

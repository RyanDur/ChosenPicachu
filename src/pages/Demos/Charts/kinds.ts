import {matchOn} from '@ryandur/sand';

export type ChartKind = 'price' | 'candles' | 'pressure' | 'pie';

export const allChartKinds: readonly ChartKind[] = ['price', 'candles', 'pressure', 'pie'];

export const isChartKind = (kind: string | undefined): kind is ChartKind =>
  allChartKinds.some(candidate => candidate === kind);

export const matchChartKind = matchOn([...allChartKinds]);

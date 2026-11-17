import {matchOn} from '@ryandur/sand';
import {demoTab, DemoTopics} from '@pages/Demos';

export type ChartKind = 'price' | 'candles' | 'pressure' | 'pie';

export type PeriodChartKind = Extract<ChartKind, 'price' | 'candles'>;

const names: Record<ChartKind, string> = {
  price: 'Price line',
  candles: 'Candles',
  pressure: 'Pressure',
  pie: 'Pie'
};

const all: readonly ChartKind[] = ['price', 'candles', 'pressure', 'pie'];

const is = (kind?: string): kind is ChartKind =>
  all.some(candidate => candidate === kind);

const match = matchOn([...all]);

const address = (kind: ChartKind): string => `${demoTab.address(DemoTopics.charts)}${kind}/`;

export const chartKinds = {all, is, match, names, address};

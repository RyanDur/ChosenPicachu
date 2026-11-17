import {matchOn, maybe, Maybe} from '@ryandur/sand';
import {generatePath} from 'react-router';
import {Paths} from '@navigation';

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

const previous = (kind: ChartKind): Maybe<ChartKind> => maybe(all[all.indexOf(kind) - 1]);

const next = (kind: ChartKind): Maybe<ChartKind> => maybe(all[all.indexOf(kind) + 1]);

const numbered = (kind: ChartKind): string => `${all.indexOf(kind) + 1}. ${names[kind]}`;

// generatePath drops the route's trailing slash, and the prerendered pages live at the slashed address.
const address = (kind: ChartKind): string => `${generatePath(Paths.chartTutorial, {kind})}/`;

export const chartKinds = {all, is, match, names, address, previous, next, numbered};

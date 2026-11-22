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

const periodic: readonly PeriodChartKind[] = ['price', 'candles'];

const hasPeriods = (kind: ChartKind): kind is PeriodChartKind => periodic.some(candidate => candidate === kind);

type Told = {
  says: string;
  minutes: number;
};

const told: Record<ChartKind, Told> = {
  price: {says: 'A line shows whether the market is climbing, stalling or rolling over, without a digit to read.', minutes: 8},
  candles: {
    says: 'Each bucket of time answers for itself: where it opened and closed, how far it reached, and how much conviction was underneath.',
    minutes: 7
  },
  pressure: {says: 'Bars show whether buyers drove the price there or the sellers stepped away.', minutes: 5},
  pie: {says: 'One circle at the session’s end shows who owned it.', minutes: 5}
};

const minutes = all.reduce((sum, kind) => sum + told[kind].minutes, 0);

const is = (kind?: string): kind is ChartKind =>
  all.some(candidate => candidate === kind);

const match = matchOn([...all]);

const previous = (kind: ChartKind): Maybe<ChartKind> => maybe(all[all.indexOf(kind) - 1]);

const next = (kind: ChartKind): Maybe<ChartKind> => maybe(all[all.indexOf(kind) + 1]);

const ordinalOf = (kind: ChartKind): number => all.indexOf(kind) + 1;

const numbered = (kind: ChartKind): string => `${ordinalOf(kind)}. ${names[kind]}`;

// generatePath drops the route's trailing slash, and the prerendered pages live at the slashed address.
const address = (kind: ChartKind): string => `${generatePath(Paths.chartTutorial, {kind})}/`;

const shownAt = (pathname: string): Maybe<ChartKind> => maybe(all.find(kind => pathname === address(kind)));

export const chartKinds = {
  all, is, hasPeriods, match, names, told, minutes, address, shownAt, previous, next, ordinalOf, numbered
};

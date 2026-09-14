import {has} from '@ryandur/sand';
import {Labelled, Seated} from '@components/DragSortableTable/table-state';
import {cents, deltaLabel} from '../../Charts/money';
import {Traded, WindowAggregate} from './fold';

const moved = (traded?: Traded): Measure =>
  has(traded) ? {display: deltaLabel(traded.opened, traded.closed), value: traded.closed - traded.opened} : {display: '—'};

const averaged = (traded?: Traded): Measure =>
  has(traded) ? {display: cents.format(traded.vwap), value: traded.vwap} : {display: '—'};

export type Measure = {
  display: string;
  value?: number;
};

export const measureNames = ['window', 'trades', 'buys', 'sells', 'volume', 'vwap', 'change'] as const;

export type MeasureName = typeof measureNames[number];

export const isMeasure = (name: string): name is MeasureName => measureNames.some(known => known === name);

export type Measures = Readonly<Record<MeasureName, Measure>>;

export type Measured = Labelled;

export const measures: readonly {name: MeasureName; data: Measured}[] =
  measureNames.map(name => ({name, data: {label: name}}));

export const seated = (rows: readonly Measures[]): readonly Seated[] =>
  rows.map(row => ({
    key: row.window.display,
    values: Object.fromEntries(measureNames.map(name => [name, row[name].value]))
  }));

export const cells = (aggregate: WindowAggregate): Measures => ({
  window: {display: aggregate.window},
  trades: {display: String(aggregate.trades), value: aggregate.trades},
  buys: {display: String(aggregate.buys), value: aggregate.buys},
  sells: {display: String(aggregate.sells), value: aggregate.sells},
  volume: {display: aggregate.volume.toFixed(2), value: aggregate.volume},
  vwap: averaged(aggregate.traded),
  change: moved(aggregate.traded)
});

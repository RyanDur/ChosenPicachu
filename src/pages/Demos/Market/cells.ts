import {has} from '@ryandur/sand';
import {Labelled, Seated} from '@components/DragSortableTable/model';
import {money} from './money';
import {LookbackTotals, Traded} from './trade-totals';

const moved = (traded?: Traded): Measure =>
  has(traded) ? {display: money.deltaLabel(traded.opened, traded.closed), value: traded.closed - traded.opened} : {display: '—'};

const averaged = (traded?: Traded): Measure =>
  has(traded) ? {display: money.cents.format(traded.vwap), value: traded.vwap} : {display: '—'};

export type Measure = {
  display: string;
  value?: number;
};

const measureNames = ['lookback', 'trades', 'buys', 'sells', 'volume', 'vwap', 'change'] as const;

export type MeasureName = typeof measureNames[number];

const isMeasure = (name: string): name is MeasureName => measureNames.some(known => known === name);

export type Measures = Readonly<Record<MeasureName, Measure>>;

export type Measured = Labelled;

const measures: readonly {name: MeasureName; data: Measured}[] =
  measureNames.map(name => ({name, data: {label: name}}));

const seated = (rows: readonly Measures[]): readonly Seated[] =>
  rows.map(row => ({
    key: row.lookback.display,
    values: Object.fromEntries(measureNames.map(name => [name, row[name].value]))
  }));

const from = (aggregate: LookbackTotals): Measures => ({
  lookback: {display: aggregate.label},
  trades: {display: String(aggregate.trades), value: aggregate.trades},
  buys: {display: String(aggregate.buys), value: aggregate.buys},
  sells: {display: String(aggregate.sells), value: aggregate.sells},
  volume: {display: aggregate.volume.toFixed(2), value: aggregate.volume},
  vwap: averaged(aggregate.traded),
  change: moved(aggregate.traded)
});

type Cells = {
  measures: readonly {name: MeasureName; data: Measured}[];
  isMeasure: (name: string) => name is MeasureName;
  seated: (rows: readonly Measures[]) => readonly Seated[];
  from: (aggregate: LookbackTotals) => Measures;
};

export const cells: Cells = {measures, isMeasure, seated, from};

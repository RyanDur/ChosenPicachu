import {has} from '@ryandur/sand';
import {Labelled, Seated} from '@components/DragSortableTable/table-state';
import {cents, deltaLabel} from '../../Charts/money';
import {WindowAggregate} from './fold';

const moved = ({opened, closed}: WindowAggregate) =>
  has(opened) && has(closed)
    ? {display: deltaLabel(opened, closed), value: closed - opened}
    : {display: '—'};

export type Measure = {
  display: string;
  value?: number;
};

export type Measures = Readonly<Record<string, Measure>>;

export type Measured = Labelled;

export const measures: readonly {name: string; data: Measured}[] =
  ['window', 'trades', 'buys', 'sells', 'volume', 'vwap', 'change']
    .map(name => ({name, data: {label: name}}));

// what the table is told about a window: its key, and its value under each measure
export const seated = (rows: readonly Measures[]): readonly Seated[] =>
  rows.map(row => ({
    key: row.window?.display ?? '',
    values: Object.fromEntries(measures.map(({name}) => [name, row[name]?.value]))
  }));


export const cells = (aggregate: WindowAggregate): Measures => ({
  window: {display: aggregate.window},
  trades: {display: String(aggregate.trades), value: aggregate.trades},
  buys: {display: String(aggregate.buys), value: aggregate.buys},
  sells: {display: String(aggregate.sells), value: aggregate.sells},
  volume: {display: aggregate.volume.toFixed(2), value: aggregate.volume},
  vwap: {display: has(aggregate.vwap) ? cents.format(aggregate.vwap) : '—', value: aggregate.vwap},
  change: moved(aggregate)
});

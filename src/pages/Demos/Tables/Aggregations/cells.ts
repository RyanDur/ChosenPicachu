import {has} from '@ryandur/sand';
import {Values} from '@components/DragSortableTable/sorting';
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

export const valuesOf = (row: Measures): Values =>
  Object.fromEntries(Object.entries(row).map(([column, {value}]) => [column, value]));

export const cells = (aggregate: WindowAggregate): Measures => ({
  window: {display: aggregate.window},
  trades: {display: String(aggregate.trades), value: aggregate.trades},
  buys: {display: String(aggregate.buys), value: aggregate.buys},
  sells: {display: String(aggregate.sells), value: aggregate.sells},
  volume: {display: aggregate.volume.toFixed(2), value: aggregate.volume},
  vwap: {display: has(aggregate.vwap) ? cents.format(aggregate.vwap) : '—', value: aggregate.vwap},
  change: moved(aggregate)
});

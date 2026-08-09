import {FC} from 'react';
import {has} from '@ryandur/sand';
import {
  EagerHideAnimatedTable, EagerHideStaticTable, EagerKeepAnimatedTable, EagerKeepStaticTable,
  LazyHideAnimatedTable, LazyHideStaticTable, LazyKeepAnimatedTable, LazyKeepStaticTable
} from '@components/DragSortableTable';
import {Motion, Origin, Pace} from '../../Controls';
import {Row} from '@components/Table';
import {Trade} from '../../Charts/coinbase';
import {cents, deltaLabel} from '../../Charts/money';
import {WindowAggregate, windowedAggregates} from './fold';
import './Aggregations.css';
import {hydrated, useRecentTrades} from './useRecentTrades';

type Props = {
  trades: readonly Trade[];
  pace: Pace;
  origin: Origin;
  motion: Motion;
};

const tables = {
  eager: {
    keep: {animated: EagerKeepAnimatedTable, static: EagerKeepStaticTable},
    hide: {animated: EagerHideAnimatedTable, static: EagerHideStaticTable}
  },
  lazy: {
    keep: {animated: LazyKeepAnimatedTable, static: LazyKeepStaticTable},
    hide: {animated: LazyHideAnimatedTable, static: LazyHideStaticTable}
  }
};

const columns = [
  {display: 'window', column: 'window', className: 'window'},
  {display: 'trades', column: 'trades', className: 'trades'},
  {display: 'buys', column: 'buys', className: 'buys'},
  {display: 'sells', column: 'sells', className: 'sells'},
  {display: 'volume', column: 'volume', className: 'volume'},
  {display: 'vwap', column: 'vwap', className: 'vwap'},
  {display: 'change', column: 'change', className: 'change'}
];

const moved = ({opened, closed}: WindowAggregate) =>
  has(opened) && has(closed)
    ? {display: deltaLabel(opened, closed), value: closed - opened}
    : {display: '—'};

const cells = (aggregate: WindowAggregate): Row => ({
  window: {display: aggregate.window},
  trades: {display: String(aggregate.trades), value: aggregate.trades},
  buys: {display: String(aggregate.buys), value: aggregate.buys},
  sells: {display: String(aggregate.sells), value: aggregate.sells},
  volume: {display: aggregate.volume.toFixed(2), value: aggregate.volume},
  vwap: {display: has(aggregate.vwap) ? cents.format(aggregate.vwap) : '—', value: aggregate.vwap},
  change: moved(aggregate)
});

export const Aggregations: FC<Props> = ({trades, pace, origin, motion}) => {
  const recent = useRecentTrades();
  const Sortable = tables[pace][origin][motion];
  return <section aria-label="live aggregations" className="aggregations card">
    <Sortable tableClassName="fancy-table"
           draggableColumns
           draggableRows
           resizableColumns
           sortable
           theadClassName="header"
           thClassName="column-name"
           trClassName="row"
           tbodyClassName="body"
           cellClassName="cell"
           columns={columns}
           rows={windowedAggregates(hydrated(recent, trades)).map(cells)}/>
    <details className="explainer">
      <summary className="prompt">what am I looking at?</summary>
      <p className="explanation">
        The stream folded into fixed windows, one column per measure: how many
        trades arrived, the split of buys and sells, the bitcoin traded, the
        volume-weighted average price paid, and how far the price moved. Every
        window is measured from the newest trade, and every cell updates as
        trades land — the grid never grows, it only breathes.
      </p>
    </details>
  </section>;
};

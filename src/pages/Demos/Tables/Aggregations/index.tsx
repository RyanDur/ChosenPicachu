import {FC} from 'react';
import {
  EagerHideAnimatedTable, EagerHideStaticTable, EagerKeepAnimatedTable, EagerKeepStaticTable,
  LazyHideAnimatedTable, LazyHideStaticTable, LazyKeepAnimatedTable, LazyKeepStaticTable
} from '@components/DragSortableTable';
import {Motion, Origin, Pace} from '../../Controls';
import {Trade} from '../../Charts/coinbase';
import {windowedAggregates} from './fold';
import {cells} from './cells';
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
  {display: 'trades', column: 'trades', className: 'trades', sortable: true},
  {display: 'buys', column: 'buys', className: 'buys', sortable: true},
  {display: 'sells', column: 'sells', className: 'sells', sortable: true},
  {display: 'volume', column: 'volume', className: 'volume', sortable: true},
  {display: 'vwap', column: 'vwap', className: 'vwap', sortable: true},
  {display: 'change', column: 'change', className: 'change', sortable: true}
];

export const Aggregations: FC<Props> = ({trades, pace, origin, motion}) => {
  const recent = useRecentTrades();
  const Sortable = tables[pace][origin][motion];
  return <section aria-label="live aggregations" className="aggregations">
    <Sortable tableClassName="fancy-table"
           draggableColumns
           draggableRows
           resizableColumns
           sortable
           theadClassName="header"
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

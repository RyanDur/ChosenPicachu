import {FC} from 'react';
import {has} from '@ryandur/sand';
import {AnimatedDragSortableTable, DragSortableTable, DragStyle} from '@components/DragSortableTable';
import {Row} from '@components/Table';
import {Trade} from '../../Charts/coinbase';
import {cents, deltaLabel} from '../../Charts/money';
import {WindowAggregate, windowedAggregates} from './fold';
import {hydrated, useRecentTrades} from './useRecentTrades';

type Props = {
  trades: readonly Trade[];
  dragStyle: DragStyle;
  animated: boolean;
};

const columns = [
  {display: 'window', column: 'window', width: 150},
  {display: 'trades', column: 'trades', width: 110},
  {display: 'buys', column: 'buys', width: 100},
  {display: 'sells', column: 'sells', width: 100},
  {display: 'volume', column: 'volume', width: 120},
  {display: 'vwap', column: 'vwap', width: 150},
  {display: 'change', column: 'change', width: 130}
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

export const Aggregations: FC<Props> = ({trades, dragStyle, animated}) => {
  const recent = useRecentTrades();
  const Sortable = animated ? AnimatedDragSortableTable : DragSortableTable;
  return <section aria-label="live aggregations" className="aggregations card">
    <Sortable tableClassName="fancy-table"
           draggableColumns={dragStyle}
           draggableRows={dragStyle}
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

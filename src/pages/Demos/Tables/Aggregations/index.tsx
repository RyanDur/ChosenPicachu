import {FC} from 'react';
import {Table} from '@components/Table';
import {Trade} from '../../Charts/coinbase';
import {AggregateRow, aggregatedMinutes} from './fold';

type Props = {
  trades: readonly Trade[];
};

const columns = [
  {display: 'time', column: 'time', width: 100},
  {display: 'trades', column: 'trades', width: 110},
  {display: 'buys', column: 'buys', width: 100},
  {display: 'sells', column: 'sells', width: 100},
  {display: 'volume', column: 'volume', width: 120},
  {display: 'vwap', column: 'vwap', width: 150},
  {display: 'change', column: 'change', width: 130}
];

const cells = (row: AggregateRow) =>
  Object.fromEntries(Object.entries(row).map(([measure, value]) => [measure, {display: value}]));

export const Aggregations: FC<Props> = ({trades}) =>
  <section aria-label="live aggregations" className="aggregations card">
    <Table tableClassName="fancy-table"
           theadClassName="header"
           thClassName="column-name"
           trClassName="row"
           tbodyClassName="body"
           cellClassName="cell"
           columns={columns}
           rows={aggregatedMinutes(trades).map(cells)}/>
    <details className="explainer">
      <summary className="prompt">what am I looking at?</summary>
      <p className="explanation">
        The stream folded minute by minute, one column per measure: how many trades
        arrived, the split of buys and sells, the bitcoin traded, the volume-weighted
        average price paid, and how far the price moved inside that minute. The
        newest minute keeps filling as trades land; finished minutes hold still.
      </p>
    </details>
  </section>;

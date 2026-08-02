import {FC} from 'react';
import {Table} from '@components/Table';
import {Trade} from '../coinbase';
import {aggregations} from './fold';

type Props = {
  trades: readonly Trade[];
};

const columns = [
  {display: 'measure', column: 'measure'},
  {display: 'value', column: 'value'}
];

export const Aggregations: FC<Props> = ({trades}) =>
  <section aria-label="live aggregations" className="aggregations card chart">
    <Table tableClassName="fancy-table"
           theadClassName="header"
           trClassName="row"
           tbodyClassName="body"
           cellClassName="cell"
           columns={columns}
           rows={aggregations(trades).map(aggregation => ({
             measure: {display: aggregation.measure},
             value: {display: aggregation.value}
           }))}/>
    <details className="explainer">
      <summary className="prompt">what am I looking at?</summary>
      <p className="explanation">
        The stream folded into running totals: how many trades have arrived, the
        split of buys and sells, the total bitcoin traded, the volume-weighted
        average price paid, and how far the price has moved since the first trade.
        Every arriving trade updates every row.
      </p>
    </details>
  </section>;

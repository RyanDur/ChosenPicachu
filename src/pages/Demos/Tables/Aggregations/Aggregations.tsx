import {Explainer} from '@components/Explainer';
import {FC, useEffect, useState} from 'react';
import {EagerTable} from '../Builds/EagerTable';
import {LazyTable} from '../Builds/LazyTable';
import {Dials, useControls} from '../../Controls';
import {prefetch, TableFrame} from '../Frame';
import {marketSelectors} from '../../Market';
import {useMarketDispatch, useMarketSelector} from '../../Market/Trading';
import {columnMoved, rowMoved, sorted} from '@components/DragSortableTable/model';
import '../Aggregations.css';

const LiveTable: FC<Dials> = ({pace, origin, motion}) => {
  const Table = pace === 'eager' ? EagerTable : LazyTable;
  const dispatch = useMarketDispatch();
  const columns = useMarketSelector(marketSelectors.columns);
  const rows = useMarketSelector(marketSelectors.rows);
  return <Table caption="Live aggregations by window" origin={origin} motion={motion} columns={columns} rows={rows}
    onColumnMoved={({column, to}) => dispatch(columnMoved(column, to))}
    onSorted={({column, direction}) => dispatch(sorted(column, direction))}
    onRowMoved={({row, to, standing}) => dispatch(rowMoved(row, to, standing))}/>;
};

const VanillaStage: FC<Dials> = dials => {
  const [stage, setStage] = useState<'framing' | 'framed'>('framing');
  return <>
    <TableFrame {...dials} concealed={stage === 'framing'} onStood={() => setStage('framed')}/>
    {stage === 'framing' && <LiveTable {...dials}/>}
  </>;
};

export const Aggregations: FC = () => {
  const {pace, origin, motion, world} = useControls();
  const dials = {pace, origin, motion};
  useEffect(() => prefetch.assembly(), []);

  return <section aria-label="live aggregations" className="aggregations card rounded-corners lifted padded contained">
    {world === 'vanilla'
      ? <VanillaStage {...dials}/>
      : <LiveTable {...dials}/>}
    <Explainer>
      The stream folded into fixed windows, one column per measure: how many
      trades arrived, the split of buys and sells, the bitcoin traded, the
      volume-weighted average price paid, and how far the price moved. Every
      window is measured from the newest trade, and every cell updates as
      trades land. The grid never grows: no row or column is added or removed. Only the numbers change,
      and while a column is sorted, the rows reseat as their numbers do.
    </Explainer>
  </section>;
};

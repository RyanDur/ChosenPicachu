import {Explainer} from '@components/Explainer';
import {FC, useEffect, useState} from 'react';
import {EagerTable} from '../Builds/EagerTable';
import {LazyTable} from '../Builds/LazyTable';
import {Dials} from '../../Controls';
import {World} from '../params';
import {TableFrame, warmed} from '../Frame/TableFrame';
import {useDemosDispatch, useDemosSelector} from '../../Provider';
import {selectColumns, selectRows} from '../../store';
import {columnMoved, rowMoved, sorted} from '@components/DragSortableTable/arrangement';
import '../Aggregations.css';

type Props = Dials & {
  world: World;
};

const LiveTable: FC<Dials> = ({pace, origin, motion}) => {
  const Table = pace === 'eager' ? EagerTable : LazyTable;
  const dispatch = useDemosDispatch();
  const columns = useDemosSelector(selectColumns);
  const rows = useDemosSelector(selectRows);
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

export const Aggregations: FC<Props> = ({world, ...dials}) => {
  useEffect(warmed, []);

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

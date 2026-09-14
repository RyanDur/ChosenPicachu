import {FC, useEffect, useState} from 'react';
import {classNames} from '@components/class-names';
import {EagerTable} from '../Builds/EagerTable';
import {LazyTable} from '../Builds/LazyTable';
import {Motion, Origin, Pace} from '../../Controls';
import {World} from '../params';
import {TableFrame, warmed} from '../Frame/TableFrame';
import {useDemosDispatch, useDemosSelector} from '../../Provider';
import {selectColumns, selectRows} from '../../store';
import {columnMoved, rowMoved, sorted} from '@components/DragSortableTable/arrangement';
import './Aggregations.css';

type Props = {
  pace: Pace;
  origin: Origin;
  motion: Motion;
  world: World;
};

export const Aggregations: FC<Props> = ({pace, origin, motion, world}) => {
  const Table = pace === 'eager' ? EagerTable : LazyTable;
  const dispatch = useDemosDispatch();
  const columns = useDemosSelector(selectColumns);
  const rows = useDemosSelector(selectRows);
  const vanilla = world === 'vanilla';
  const [stood, setStood] = useState(false);

  useEffect(warmed, []);

  useEffect(() => {
    if (!vanilla) {
      setStood(false);
    }
  }, [vanilla]);

  return <section aria-label="live aggregations" className="aggregations">
    {vanilla &&
      <TableFrame pace={pace} origin={origin} motion={motion}
        veiled={!stood} onStand={() => setStood(true)}/>}
    {(!vanilla || !stood) && <Table className={classNames(origin, motion)} columns={columns} rows={rows}
      onColumnMoved={({column, to}) => dispatch(columnMoved(column, to))}
      onSorted={({column, direction}) => dispatch(sorted(column, direction))}
      onRowMoved={({row, to, standing}) => dispatch(rowMoved(row, to, standing))}/>}
    <details className="explainer">
      <summary className="prompt">what am I looking at?</summary>
      <p className="explanation">
        The stream folded into fixed windows, one column per measure: how many
        trades arrived, the split of buys and sells, the bitcoin traded, the
        volume-weighted average price paid, and how far the price moved. Every
        window is measured from the newest trade, and every cell updates as
        trades land: the grid never grows, it only breathes.
      </p>
    </details>
  </section>;
};

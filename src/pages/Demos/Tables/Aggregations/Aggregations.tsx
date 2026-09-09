import {FC, useEffect, useState} from 'react';
import {EagerKeepAnimatedTable} from '../Builds/EagerKeepAnimatedTable';
import {EagerKeepStaticTable} from '../Builds/EagerKeepStaticTable';
import {EagerHideAnimatedTable} from '../Builds/EagerHideAnimatedTable';
import {EagerHideStaticTable} from '../Builds/EagerHideStaticTable';
import {LazyKeepAnimatedTable} from '../Builds/LazyKeepAnimatedTable';
import {LazyKeepStaticTable} from '../Builds/LazyKeepStaticTable';
import {LazyHideAnimatedTable} from '../Builds/LazyHideAnimatedTable';
import {LazyHideStaticTable} from '../Builds/LazyHideStaticTable';
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

export const Aggregations: FC<Props> = ({pace, origin, motion, world}) => {
  const Table = tables[pace][origin][motion];
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
    {(!vanilla || !stood) && <Table columns={columns} rows={rows}
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

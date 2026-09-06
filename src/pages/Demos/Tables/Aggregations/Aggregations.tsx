import {FC, useEffect, useState} from 'react';
import * as EagerKeepAnimated from '@components/DragSortableTable/EagerKeepAnimatedTable';
import * as EagerKeepStatic from '@components/DragSortableTable/EagerKeepStaticTable';
import * as EagerHideAnimated from '@components/DragSortableTable/EagerHideAnimatedTable';
import * as EagerHideStatic from '@components/DragSortableTable/EagerHideStaticTable';
import * as LazyKeepAnimated from '@components/DragSortableTable/LazyKeepAnimatedTable';
import * as LazyKeepStatic from '@components/DragSortableTable/LazyKeepStaticTable';
import * as LazyHideAnimated from '@components/DragSortableTable/LazyHideAnimatedTable';
import * as LazyHideStatic from '@components/DragSortableTable/LazyHideStaticTable';
import {Motion, Origin, Pace} from '../../Controls';
import {World} from '../params';
import {TableFrame, warmed} from '../Frame/TableFrame';
import {Trade} from '../../Charts/coinbase';
import {windowedAggregates} from './fold';
import {cells, valuesOf} from './cells';
import {AggregatesTable, measures} from './AggregatesTable';
import {SeatedTable} from '@components/DragSortableTable/SeatedTable';
import './Aggregations.css';
import {hydrated, useRecentTrades} from './useRecentTrades';

type Props = {
  trades: readonly Trade[];
  pace: Pace;
  origin: Origin;
  motion: Motion;
  world: World;
};

const tables = {
  eager: {
    keep: {animated: EagerKeepAnimated, static: EagerKeepStatic},
    hide: {animated: EagerHideAnimated, static: EagerHideStatic}
  },
  lazy: {
    keep: {animated: LazyKeepAnimated, static: LazyKeepStatic},
    hide: {animated: LazyHideAnimated, static: LazyHideStatic}
  }
};

export const Aggregations: FC<Props> = ({trades, pace, origin, motion, world}) => {
  const recent = useRecentTrades();
  const {Table: Sortable} = tables[pace][origin][motion];
  const rows = windowedAggregates(hydrated(recent, trades)).map(cells);
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
    <SeatedTable columns={measures} values={rows.map(valuesOf)}>
      {(!vanilla || !stood) &&
        <Sortable>
          <AggregatesTable rows={rows}/>
        </Sortable>}
    </SeatedTable>
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

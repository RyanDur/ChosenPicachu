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
import {cells} from './cells';
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
  const {Table: Sortable, Column, DraggableColumn, DraggableRow, Cell, SortMenu, ResizeHandle} = tables[pace][origin][motion];
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
    {(!vanilla || !stood) &&
      <Sortable>
        <Column name="window" className="window">window<ResizeHandle/></Column>
        <DraggableColumn name="trades" className="trades">trades<SortMenu/><ResizeHandle/></DraggableColumn>
        <DraggableColumn name="buys" className="buys">buys<SortMenu/><ResizeHandle/></DraggableColumn>
        <DraggableColumn name="sells" className="sells">sells<SortMenu/><ResizeHandle/></DraggableColumn>
        <DraggableColumn name="volume" className="volume">volume<SortMenu/><ResizeHandle/></DraggableColumn>
        <DraggableColumn name="vwap" className="vwap">vwap<SortMenu/><ResizeHandle/></DraggableColumn>
        <Column name="change" className="change">change<SortMenu/><ResizeHandle/></Column>

        {windowedAggregates(hydrated(recent, trades)).map(aggregate => {
          const row = cells(aggregate);

          return <DraggableRow key={aggregate.window}>
            <Cell column="window">{row.window.display}</Cell>
            <Cell column="trades" value={row.trades.value}>{row.trades.display}</Cell>
            <Cell column="buys" value={row.buys.value}>{row.buys.display}</Cell>
            <Cell column="sells" value={row.sells.value}>{row.sells.display}</Cell>
            <Cell column="volume" value={row.volume.value}>{row.volume.display}</Cell>
            <Cell column="vwap" value={row.vwap.value}>{row.vwap.display}</Cell>
            <Cell column="change" value={row.change.value}>{row.change.display}</Cell>
          </DraggableRow>;
        })}
      </Sortable>}
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

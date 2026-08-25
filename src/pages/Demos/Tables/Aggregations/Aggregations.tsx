import {FC, useEffect, useState} from 'react';
import {
  EagerHideAnimatedTable, EagerHideStaticTable, EagerKeepAnimatedTable, EagerKeepStaticTable,
  LazyHideAnimatedTable, LazyHideStaticTable, LazyKeepAnimatedTable, LazyKeepStaticTable
} from '@components/DragSortableTable';
import {Motion, Origin, Pace} from '../../Controls';
import {World} from '../params';
import {TableFrame, warmed} from '../Frame/TableFrame';
import {Trade} from '../../Charts/coinbase';
import {windowedAggregates} from './fold';
import {cells} from './cells';
import {Cell, Column, Row} from '@components/Table';
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
    keep: {animated: EagerKeepAnimatedTable, static: EagerKeepStaticTable},
    hide: {animated: EagerHideAnimatedTable, static: EagerHideStaticTable}
  },
  lazy: {
    keep: {animated: LazyKeepAnimatedTable, static: LazyKeepStaticTable},
    hide: {animated: LazyHideAnimatedTable, static: LazyHideStaticTable}
  }
};


export const Aggregations: FC<Props> = ({trades, pace, origin, motion, world}) => {
  const recent = useRecentTrades();
  const Sortable = tables[pace][origin][motion];
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
      <Sortable draggableColumns draggableRows resizableColumns sortable>
        <Column name="window" className="window">window</Column>
        <Column name="trades" className="trades" sortable>trades</Column>
        <Column name="buys" className="buys" sortable>buys</Column>
        <Column name="sells" className="sells" sortable>sells</Column>
        <Column name="volume" className="volume" sortable>volume</Column>
        <Column name="vwap" className="vwap" sortable>vwap</Column>
        <Column name="change" className="change" sortable>change</Column>

        {windowedAggregates(hydrated(recent, trades)).map(aggregate => {
          const row = cells(aggregate);

          return <Row key={aggregate.window}>
            <Cell column="window">{row.window.display}</Cell>
            <Cell column="trades" value={row.trades.value}>{row.trades.display}</Cell>
            <Cell column="buys" value={row.buys.value}>{row.buys.display}</Cell>
            <Cell column="sells" value={row.sells.value}>{row.sells.display}</Cell>
            <Cell column="volume" value={row.volume.value}>{row.volume.display}</Cell>
            <Cell column="vwap" value={row.vwap.value}>{row.vwap.display}</Cell>
            <Cell column="change" value={row.change.value}>{row.change.display}</Cell>
          </Row>;
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

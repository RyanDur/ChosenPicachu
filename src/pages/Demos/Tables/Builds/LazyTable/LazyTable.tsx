import {FC} from 'react';
import {Body, BodyEvents, Cell, Column, DragSortable, HeaderEvents, Headers, Motion, Origin, ResizeHandle, Row, SortMenu, useDragSortable} from '@components/DragSortableTable';
import {Measured, Measures, cells} from '../../../Market';
import {DirectionWord} from '../DirectionWord';
import {TableColumn, tableReports, tableReads} from '@components/DragSortableTable/model';
import {DraggableColumn} from './DraggableColumn';
import {RowHeader} from './RowHeader';

type Props = HeaderEvents & BodyEvents & {
  caption: string;
  origin: Origin;
  motion: Motion;
  columns: readonly TableColumn<Measured>[];
  rows: readonly Measures[];
};

export const LazyTable: FC<Props> = ({caption, origin, motion, columns, rows, onColumnMoved, onSorted, onRowMoved}) => {
  const sortable = useDragSortable(columns, cells.seated(rows), {origin, motion});
  return <DragSortable value={sortable}>
    <table id="live-aggregations" className={sortable.className}>
      <caption className="off-screen">{caption}</caption>
      <thead>
        <Headers onColumnMoved={onColumnMoved} onSorted={onSorted}>
          <Column column="lookback" className="lookback">lookback
            <ResizeHandle column="lookback"/>
          </Column>
          <DraggableColumn column="trades" className="trades">trades
            <SortMenu column="trades"/>
            <ResizeHandle column="trades"/>
          </DraggableColumn>
          <DraggableColumn column="buys" className="buys">buys
            <SortMenu column="buys"/>
            <ResizeHandle column="buys"/>
          </DraggableColumn>
          <DraggableColumn column="sells" className="sells">sells
            <SortMenu column="sells"/>
            <ResizeHandle column="sells"/>
          </DraggableColumn>
          <DraggableColumn column="volume" className="volume">volume
            <SortMenu column="volume"/>
            <ResizeHandle column="volume"/>
          </DraggableColumn>
          <DraggableColumn column="vwap" className="vwap">vwap
            <SortMenu column="vwap"/>
            <ResizeHandle column="vwap"/>
          </DraggableColumn>
          <Column column="change" className="change">change
            <SortMenu column="change"/>
            <ResizeHandle column="change"/>
          </Column>
        </Headers>
      </thead>
      <Body onRowMoved={onRowMoved}>
        {rows.map(row => {
          const lookback = row.lookback.key;
          return <Row key={lookback}>
            <RowHeader column="lookback" row={lookback} label={row.lookback.display}/>
            <Cell column="trades" row={lookback} data-moved={row.trades.moved}>{row.trades.display}<DirectionWord>{row.trades.moved}</DirectionWord></Cell>
            <Cell column="buys" row={lookback} data-moved={row.buys.moved}>{row.buys.display}<DirectionWord>{row.buys.moved}</DirectionWord></Cell>
            <Cell column="sells" row={lookback} data-moved={row.sells.moved}>{row.sells.display}<DirectionWord>{row.sells.moved}</DirectionWord></Cell>
            <Cell column="volume" row={lookback} data-moved={row.volume.moved}>{row.volume.display}<DirectionWord>{row.volume.moved}</DirectionWord></Cell>
            <Cell column="vwap" row={lookback} data-moved={row.vwap.moved}>{row.vwap.display}<DirectionWord>{row.vwap.moved}</DirectionWord></Cell>
            <Cell column="change" row={lookback} data-moved={row.change.moved}>{row.change.display}<DirectionWord>{row.change.moved}</DirectionWord></Cell>
          </Row>;
        })}
      </Body>
    </table>
    <output className="off-screen" htmlFor="live-aggregations" aria-label="move report">{tableReports.spoken(tableReads.report(sortable))}</output>
  </DragSortable>;
};

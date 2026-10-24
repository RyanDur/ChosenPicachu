import {FC} from 'react';
import {ResizeHandle} from '@components/DragSortableTable/ResizeHandle';
import {SortMenu} from '@components/DragSortableTable/SortMenu';
import {Measured, Measures, seated} from '../../Aggregations/cells';
import {BodyEvents, HeaderEvents} from '@components/DragSortableTable/context';
import {TableColumn} from '@components/DragSortableTable/table-state';
import {Motion, Origin, reportOf, useDragSortable} from '@components/DragSortableTable/useDragSortable';
import {Body, Cell, Column, DraggableColumn, DragSortable, Headers, Row, RowHeader} from '@components/DragSortableTable';

type Props = HeaderEvents & BodyEvents & {
  caption: string;
  origin: Origin;
  motion: Motion;
  columns: readonly TableColumn<Measured>[];
  rows: readonly Measures[];
};

export const EagerTable: FC<Props> = ({caption, origin, motion, columns, rows, onColumnMoved, onSorted, onRowMoved}) => {
  const sortable = useDragSortable(columns, seated(rows), {origin, motion});
  return <DragSortable value={sortable}>
    <table id="live-aggregations" className={sortable.className}>
      <caption className="off-screen">{caption}</caption>
      <thead>
        <Headers onColumnMoved={onColumnMoved} onSorted={onSorted}>
          <Column column="window" className="window">window<ResizeHandle column="window"/></Column>
          <DraggableColumn column="trades" className="trades">trades<SortMenu column="trades"/><ResizeHandle column="trades"/></DraggableColumn>
          <DraggableColumn column="buys" className="buys">buys<SortMenu column="buys"/><ResizeHandle column="buys"/></DraggableColumn>
          <DraggableColumn column="sells" className="sells">sells<SortMenu column="sells"/><ResizeHandle column="sells"/></DraggableColumn>
          <DraggableColumn column="volume" className="volume">volume<SortMenu column="volume"/><ResizeHandle column="volume"/></DraggableColumn>
          <DraggableColumn column="vwap" className="vwap">vwap<SortMenu column="vwap"/><ResizeHandle column="vwap"/></DraggableColumn>
          <Column column="change" className="change">change<SortMenu column="change"/><ResizeHandle column="change"/></Column>
        </Headers>
      </thead>
      <Body onRowMoved={onRowMoved}>
        {rows.map(row => {
          const window = row.window.display;
          return <Row key={window}>
            <RowHeader column="window" row={window} label={window}/>
            <Cell column="trades" row={window}>{row.trades.display}</Cell>
            <Cell column="buys" row={window}>{row.buys.display}</Cell>
            <Cell column="sells" row={window}>{row.sells.display}</Cell>
            <Cell column="volume" row={window}>{row.volume.display}</Cell>
            <Cell column="vwap" row={window}>{row.vwap.display}</Cell>
            <Cell column="change" row={window}>{row.change.display}</Cell>
          </Row>;
        })}
      </Body>
    </table>
    <output className="off-screen" htmlFor="live-aggregations" aria-label="move report">{reportOf(sortable)}</output>
  </DragSortable>;
};

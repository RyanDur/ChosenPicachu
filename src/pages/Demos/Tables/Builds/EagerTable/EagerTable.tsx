import {ComponentProps, FC} from 'react';
import {classNames} from '@components/class-names';
import {ResizeHandle} from '@components/DragSortableTable/ResizeHandle';
import {SortMenu} from '@components/DragSortableTable/SortMenu';
import {Measured, Measures, seated} from '../../Aggregations/cells';
import {BodyEvents, HeaderEvents} from '@components/DragSortableTable/context';
import {TableColumn} from '@components/DragSortableTable/table-state';
import {Body, Cell, Column, DraggableColumn, DragSortableTable, Headers, Row, RowHeader} from '@components/DragSortableTable';
import '@components/DragSortableTable/sortable.css';

type Props = ComponentProps<'table'> & HeaderEvents & BodyEvents & {
  columns: readonly TableColumn<Measured>[];
  rows: readonly Measures[];
};

export const EagerTable: FC<Props> = ({columns, rows, onColumnMoved, onSorted, onRowMoved, className, ...table}) =>
  <DragSortableTable {...table} className={classNames('fancy-table sortable apportioned', className)} columns={columns} rows={seated(rows)}>
    <thead className="header">
      <Headers className="row" onColumnMoved={onColumnMoved} onSorted={onSorted}>
        <Column column="window" className="cell window header-cell">window<ResizeHandle column="window"/></Column>
        <DraggableColumn column="trades" className="cell trades header-cell">trades<SortMenu column="trades"/><ResizeHandle column="trades"/></DraggableColumn>
        <DraggableColumn column="buys" className="cell buys header-cell">buys<SortMenu column="buys"/><ResizeHandle column="buys"/></DraggableColumn>
        <DraggableColumn column="sells" className="cell sells header-cell">sells<SortMenu column="sells"/><ResizeHandle column="sells"/></DraggableColumn>
        <DraggableColumn column="volume" className="cell volume header-cell">volume<SortMenu column="volume"/><ResizeHandle column="volume"/></DraggableColumn>
        <DraggableColumn column="vwap" className="cell vwap header-cell">vwap<SortMenu column="vwap"/><ResizeHandle column="vwap"/></DraggableColumn>
        <Column column="change" className="cell change header-cell">change<SortMenu column="change"/><ResizeHandle column="change"/></Column>
      </Headers>
    </thead>
    <Body className="body" onRowMoved={onRowMoved}>
      {rows.map(row => {
        const window = row.window.display;
        return <Row key={window} row={window} className="row">
          <RowHeader column="window" row={window} className="cell row-header" label={window}/>
          <Cell column="trades" row={window} className="cell">{row.trades.display}</Cell>
          <Cell column="buys" row={window} className="cell">{row.buys.display}</Cell>
          <Cell column="sells" row={window} className="cell">{row.sells.display}</Cell>
          <Cell column="volume" row={window} className="cell">{row.volume.display}</Cell>
          <Cell column="vwap" row={window} className="cell">{row.vwap.display}</Cell>
          <Cell column="change" row={window} className="cell">{row.change.display}</Cell>
        </Row>;
      })}
    </Body>
  </DragSortableTable>;

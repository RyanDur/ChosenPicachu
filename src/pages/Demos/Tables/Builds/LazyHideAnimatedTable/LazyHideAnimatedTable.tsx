import {FC} from 'react';
import {ResizeHandle} from '@components/Table/ResizeHandle';
import {SortMenu} from '@components/DragSortableTable/SortMenu';
import {Measures, measures, seated} from '../../Aggregations/cells';
import {Body, DragSortableTable, Headers, Row} from '@components/DragSortableTable';
import {Column} from './Column';
import {DraggableColumn} from './DraggableColumn';
import {RowHeader} from './RowHeader';
import {Cell} from './Cell';
import '@components/DragSortableTable/sortable.css';
import './LazyHideAnimatedTable.css';

export const LazyHideAnimatedTable: FC<{rows: readonly Measures[]}> = ({rows}) =>
  <DragSortableTable className="fancy-table sortable apportioned" columns={measures} rows={seated(rows)}>
    <thead className="header">
    <Headers className="row">
      <Column column="window" className="cell window header-cell">window<ResizeHandle column="window"/></Column>
      <DraggableColumn column="trades" className="cell trades header-cell">trades<SortMenu column="trades"/><ResizeHandle column="trades"/></DraggableColumn>
      <DraggableColumn column="buys" className="cell buys header-cell">buys<SortMenu column="buys"/><ResizeHandle column="buys"/></DraggableColumn>
      <DraggableColumn column="sells" className="cell sells header-cell">sells<SortMenu column="sells"/><ResizeHandle column="sells"/></DraggableColumn>
      <DraggableColumn column="volume" className="cell volume header-cell">volume<SortMenu column="volume"/><ResizeHandle column="volume"/></DraggableColumn>
      <DraggableColumn column="vwap" className="cell vwap header-cell">vwap<SortMenu column="vwap"/><ResizeHandle column="vwap"/></DraggableColumn>
      <Column column="change" className="cell change header-cell">change<SortMenu column="change"/><ResizeHandle column="change"/></Column>
    </Headers>
    </thead>
    <Body className="body">
    {rows.map(row => {
      const window = row.window?.display ?? '';
      return <Row key={window} row={window} className="row">
        <RowHeader column="window" row={window} className="cell row-header" label={window}/>
        <Cell column="trades" row={window} className="cell">{row.trades?.display}</Cell>
        <Cell column="buys" row={window} className="cell">{row.buys?.display}</Cell>
        <Cell column="sells" row={window} className="cell">{row.sells?.display}</Cell>
        <Cell column="volume" row={window} className="cell">{row.volume?.display}</Cell>
        <Cell column="vwap" row={window} className="cell">{row.vwap?.display}</Cell>
        <Cell column="change" row={window} className="cell">{row.change?.display}</Cell>
      </Row>;
    })}
    </Body>
  </DragSortableTable>;

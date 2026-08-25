import {ReactNode} from 'react';
import {Cell, Column, DraggableColumn, DraggableRow, ResizeHandle, Row, RowData, SortMenu} from '@components/Table';

type Fixture = {
  column: string;
  display: ReactNode;
  className?: string;
  sortable?: boolean;
};

type Kinds = {
  draggable?: boolean;
  gripped?: boolean;
  sortable?: boolean;
  resizable?: boolean;
};

export const deal = (columns: Fixture[], rows: RowData[], kinds: Kinds = {}): ReactNode[] => [
  ...columns.map(({column, display, className, sortable}, at) => {
    const Heading = kinds.draggable && at > 0 && at < columns.length - 1 ? DraggableColumn : Column;
    return <Heading key={column} name={column} className={className}>
      {display}
      {kinds.sortable && sortable && <SortMenu/>}
      {kinds.resizable && <ResizeHandle/>}
    </Heading>;
  }),
  ...rows.map((row, at) => {
    const Lane = kinds.gripped ? DraggableRow : Row;
    return <Lane key={at}>
      {Object.entries(row).map(([column, {display, className, value}]) =>
        <Cell key={column} column={column} className={className} value={value}>{display}</Cell>)}
    </Lane>;
  })
];

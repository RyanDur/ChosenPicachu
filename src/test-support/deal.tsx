import {ReactNode} from 'react';
import {Kit, RowData} from '@components/Table';

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

export const deal = (kit: Kit, columns: Fixture[], rows: RowData[], kinds: Kinds = {}): ReactNode[] => [
  ...columns.map(({column, display, className, sortable}, at) => {
    const Heading = kinds.draggable && at > 0 && at < columns.length - 1 ? kit.DraggableColumn : kit.Column;
    return <Heading key={column} name={column} className={className}>
      {display}
      {kinds.sortable && sortable && <kit.SortMenu/>}
      {kinds.resizable && <kit.ResizeHandle/>}
    </Heading>;
  }),
  ...rows.map((row, at) => {
    const Lane = kinds.gripped ? kit.DraggableRow : kit.Row;
    return <Lane key={at}>
      {Object.entries(row).map(([column, {display, className, value}]) =>
        <kit.Cell key={column} column={column} className={className} value={value}>{display}</kit.Cell>)}
    </Lane>;
  })
];

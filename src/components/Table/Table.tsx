import {ReactNode} from 'react';

export type Cell = {
  display: ReactNode;
  className?: string;
  value?: number | string;
}

export type Row = {
  [column in string | number]: Cell;
};

export type Column = Cell & {
  column: string;
  sortable?: boolean;
}

export type TableProps = {
  columns: Column[];
  rows: Row[];
  id?: string;
  resizableColumns?: boolean;
};

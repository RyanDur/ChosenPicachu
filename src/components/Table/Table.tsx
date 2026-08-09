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

export type Dress = {
  tableClassName?: string;
  theadClassName?: string;
  tbodyClassName?: string;
  trClassName?: string;
  thClassName?: string;
  tdClassName?: string;
  headerRowClassName?: string;
  rowClassName?: string;
  cellClassName?: string;
};

export type TableProps = Dress & {
  columns: Column[];
  rows: Row[];
  id?: string;
  resizableColumns?: boolean;
};

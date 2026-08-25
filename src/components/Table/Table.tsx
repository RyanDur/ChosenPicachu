import {Children, FC, Fragment, PropsWithChildren, ReactNode, isValidElement} from 'react';

export type CellData = {
  display: ReactNode;
  className?: string;
  value?: number | string;
}

export type RowData = {
  [column in string | number]: CellData;
};

export type ColumnData = CellData & {
  column: string;
  sortable?: boolean;
}

export type TableProps = PropsWithChildren<{
  id?: string;
  resizableColumns?: boolean;
}>;

type ColumnProps = PropsWithChildren<{
  name: string;
  className?: string;
  sortable?: boolean;
}>;

type CellProps = PropsWithChildren<{
  column: string;
  className?: string;
  value?: number | string;
}>;

export const Column: FC<ColumnProps> = () => null;
export const Row: FC<PropsWithChildren> = () => null;
export const Cell: FC<CellProps> = () => null;

const cellsOf = (children: ReactNode): RowData => {
  const cells: Record<string, CellData> = {};
  Children.forEach(children, child => {
    if (isValidElement<CellProps>(child) && child.type === Cell) {
      const {column, className, value, children: display} = child.props;
      cells[column] = {display, className, value};
    }
  });
  return cells;
};

export const dealt = (children: ReactNode): {columns: ColumnData[]; rows: RowData[]} => {
  const columns: ColumnData[] = [];
  const rows: RowData[] = [];

  const read = (hand: ReactNode): void => Children.forEach(hand, child => {
    if (isValidElement<ColumnProps>(child) && child.type === Column) {
      const {name, className, sortable, children: display} = child.props;
      columns.push({column: name, display, className, sortable});
    } else if (isValidElement<PropsWithChildren>(child) && child.type === Row) {
      rows.push(cellsOf(child.props.children));
    } else if (isValidElement<PropsWithChildren>(child) && child.type === Fragment) {
      read(child.props.children);
    }
  });

  read(children);
  return {columns, rows};
};

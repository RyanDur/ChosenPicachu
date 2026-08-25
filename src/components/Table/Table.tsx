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
  draggable: boolean;
  sortable: boolean;
  resizable: boolean;
}

export type TableProps = PropsWithChildren<{
  id?: string;
}>;

type ColumnProps = PropsWithChildren<{
  name: string;
  className?: string;
}>;

type CellProps = PropsWithChildren<{
  column: string;
  className?: string;
  value?: number | string;
}>;

export const Column: FC<ColumnProps> = () => null;
export const DraggableColumn: FC<ColumnProps> = () => null;
export const SortMenu: FC = () => null;
export const ResizeHandle: FC = () => null;
export const Row: FC<PropsWithChildren> = () => null;
export const DraggableRow: FC<PropsWithChildren> = () => null;
export const Cell: FC<CellProps> = () => null;

const carries = (children: ReactNode, control: FC): boolean =>
  Children.toArray(children).some(child => isValidElement(child) && child.type === control);

const heading = (children: ReactNode): ReactNode =>
  Children.toArray(children).filter(child =>
    !(isValidElement(child) && (child.type === SortMenu || child.type === ResizeHandle)));

const columnOf = (element: {props: ColumnProps}, draggable: boolean): ColumnData => {
  const {name, className, children} = element.props;
  return {
    column: name,
    className,
    display: heading(children),
    draggable,
    sortable: carries(children, SortMenu),
    resizable: carries(children, ResizeHandle)
  };
};

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

export type Dealt = {
  columns: ColumnData[];
  rows: RowData[];
  gripped: boolean[];
};

export const dealt = (children: ReactNode): Dealt => {
  const columns: ColumnData[] = [];
  const rows: RowData[] = [];
  const gripped: boolean[] = [];

  const read = (hand: ReactNode): void => Children.forEach(hand, child => {
    if (!isValidElement(child)) {
      return;
    }
    if (isValidElement<ColumnProps>(child) && child.type === Column) {
      columns.push(columnOf(child, false));
    } else if (isValidElement<ColumnProps>(child) && child.type === DraggableColumn) {
      columns.push(columnOf(child, true));
    } else if (isValidElement<PropsWithChildren>(child) && child.type === Row) {
      rows.push(cellsOf(child.props.children));
      gripped.push(false);
    } else if (isValidElement<PropsWithChildren>(child) && child.type === DraggableRow) {
      rows.push(cellsOf(child.props.children));
      gripped.push(true);
    } else if (isValidElement<PropsWithChildren>(child) && child.type === Fragment) {
      read(child.props.children);
    }
  });

  read(children);
  return {columns, rows, gripped};
};

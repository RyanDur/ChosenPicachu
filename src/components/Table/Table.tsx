import {Children, FC, Fragment, ReactElement, ReactNode, isValidElement} from 'react';

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

export type TableProps = {
  id?: string;
  children?: ReactNode;
};

export type ColumnProps = {
  name: string;
  className?: string;
  children?: ReactNode;
};

export type RowProps = {
  children?: ReactNode;
};

export type CellProps = {
  column: string;
  className?: string;
  value?: number | string;
  children?: ReactNode;
};

export type Kit = {
  Column: FC<ColumnProps>;
  DraggableColumn: FC<ColumnProps>;
  Row: FC<RowProps>;
  DraggableRow: FC<RowProps>;
  Cell: FC<CellProps>;
  SortMenu: FC;
  ResizeHandle: FC;
};

export type Dealt = {
  columns: ColumnData[];
  rows: RowData[];
  gripped: boolean[];
  columnElements: Record<string, ReactElement>;
  rowElements: ReactElement[];
};

export const carries = (children: ReactNode, control: FC): boolean =>
  Children.toArray(children).some(child => isValidElement(child) && child.type === control);

export const heading = (children: ReactNode, controls: FC[]): ReactNode =>
  Children.toArray(children).filter(child =>
    !(isValidElement(child) && controls.some(control => child.type === control)));

const columnOf = (element: ReactElement<ColumnProps>, kit: Kit, draggable: boolean): ColumnData => {
  const {name, className, children} = element.props;
  return {
    column: name,
    className,
    display: heading(children, [kit.SortMenu, kit.ResizeHandle]),
    draggable,
    sortable: carries(children, kit.SortMenu),
    resizable: carries(children, kit.ResizeHandle)
  };
};

const cellsOf = (children: ReactNode, kit: Kit): RowData => {
  const cells: Record<string, CellData> = {};
  Children.forEach(children, child => {
    if (isValidElement<CellProps>(child) && child.type === kit.Cell) {
      const {column, className, value, children: display} = child.props;
      cells[column] = {display, className, value};
    }
  });
  return cells;
};

export const dealt = (children: ReactNode, kit: Kit): Dealt => {
  const columns: ColumnData[] = [];
  const rows: RowData[] = [];
  const gripped: boolean[] = [];
  const columnElements: Record<string, ReactElement> = {};
  const rowElements: ReactElement[] = [];

  const read = (hand: ReactNode): void => Children.forEach(hand, child => {
    if (!isValidElement(child)) {
      return;
    }
    if (isValidElement<ColumnProps>(child) && (child.type === kit.Column || child.type === kit.DraggableColumn)) {
      columns.push(columnOf(child, kit, child.type === kit.DraggableColumn));
      columnElements[child.props.name] = child;
    } else if (isValidElement<RowProps>(child) && (child.type === kit.Row || child.type === kit.DraggableRow)) {
      rows.push(cellsOf(child.props.children, kit));
      gripped.push(child.type === kit.DraggableRow);
      rowElements.push(child);
    } else if (isValidElement<RowProps>(child) && child.type === Fragment) {
      read(child.props.children);
    }
  });

  read(children);
  return {columns, rows, gripped, columnElements, rowElements};
};

import {Dispatch, createContext} from 'react';
import {Direction, TableAction, TableView, tableState} from './model';

export type TableContext = TableView & {
  readonly dispatch: Dispatch<TableAction>;
};

export type ColumnMoved = {readonly column: string; readonly to: number};
export type RowMoved = {readonly row: string; readonly to: number; readonly standing: readonly string[]};
export type Sorted = {readonly column: string; readonly direction?: Direction};

export type HeaderEvents = {
  readonly onColumnMoved?: (moved: ColumnMoved) => void;
  readonly onSorted?: (sorted: Sorted) => void;
};

export type BodyEvents = {
  readonly onRowMoved?: (moved: RowMoved) => void;
};

export const tableContexts = {
  State: createContext<TableContext>({state: tableState.resting, columns: [], rows: [], dispatch: () => undefined}),
  Header: createContext<HeaderEvents>({}),
  Body: createContext<BodyEvents>({})
};

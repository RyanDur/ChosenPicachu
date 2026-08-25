import {createContext, useContext} from 'react';
import {RowData} from '@components/Table';
import {TableState, dealtTableState} from './table-state';
import {RowsMoved, ColumnsMoved} from './survey';

export type TableContext = {
  state: TableState;
  rows: RowData[];
  standing: readonly number[];
  clipped: boolean;
  commit: (transition: (state: TableState) => TableState) => void;
};

const unmounted: TableContext = {
  state: dealtTableState([], 0),
  rows: [],
  standing: [],
  clipped: false,
  commit: () => undefined
};

export const Table = createContext<TableContext>(unmounted);
export const useTable = (): TableContext => useContext(Table);

export type MovedContext = {
  columnsMoved?: ColumnsMoved;
  rowsMoved?: RowsMoved;
  columnsMove: (marks?: ColumnsMoved) => void;
  rowsMove: (drops?: RowsMoved) => void;
};

export const Moved = createContext<MovedContext>({columnsMove: () => undefined, rowsMove: () => undefined});
export const useMoved = (): MovedContext => useContext(Moved);

export const Seat = createContext<number>(0);
export const useSeat = (): number => useContext(Seat);

export type RowContext = {
  row: number;
  position: number;
  gripped: boolean;
};

export const RowSetting = createContext<RowContext>({row: 0, position: 0, gripped: false});
export const useRow = (): RowContext => useContext(RowSetting);

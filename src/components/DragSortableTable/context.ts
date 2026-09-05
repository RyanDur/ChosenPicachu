import {createContext, useContext} from 'react';
import {RowData} from '@components/Table';
import {TableState, dealtTableState} from './table-state';

export type Transition = (state: TableState) => TableState;

export type TableContext = {
  state: TableState;
  rows: RowData[];
  standing: readonly number[];
  clipped: boolean;
  commit: (transition: Transition) => void;
  settle: (transition: Transition) => void;
};

const unmounted: TableContext = {
  state: dealtTableState([], 0),
  rows: [],
  standing: [],
  clipped: false,
  commit: () => undefined,
  settle: () => undefined
};

export const Table = createContext<TableContext>(unmounted);
export const useTable = (): TableContext => useContext(Table);

export const Seat = createContext<number>(0);
export const useSeat = (): number => useContext(Seat);

export type RowContext = {
  row: number;
  position: number;
  gripped: boolean;
};

export const RowSetting = createContext<RowContext>({row: 0, position: 0, gripped: false});
export const useRow = (): RowContext => useContext(RowSetting);

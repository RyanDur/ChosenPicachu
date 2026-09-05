import {createContext, useContext, useSyncExternalStore} from 'react';
import {RowData} from '@components/Table';
import {TableState, TableStore, Transition, dealtTableState, tableStore} from './table-state';

export type {Transition};

export type TableContext = {
  store: TableStore;
  rows: RowData[];
  standing: readonly number[];
  clipped: boolean;
  settle: (transition: Transition) => void;
};

const unmounted: TableContext = {
  store: tableStore(dealtTableState([], 0)),
  rows: [],
  standing: [],
  clipped: false,
  settle: () => undefined
};

export const Table = createContext<TableContext>(unmounted);
export const useTable = (): TableContext => useContext(Table);

export const useTableState = <Slice,>(select: (state: TableState) => Slice): Slice => {
  const {store} = useTable();
  return useSyncExternalStore(store.subscribe, () => select(store.state()));
};

export const Seat = createContext<number>(0);
export const useSeat = (): number => useContext(Seat);

export type RowContext = {
  row: number;
  position: number;
  gripped: boolean;
};

export const RowSetting = createContext<RowContext>({row: 0, position: 0, gripped: false});
export const useRow = (): RowContext => useContext(RowSetting);

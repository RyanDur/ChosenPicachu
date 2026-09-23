import {Dispatch, createContext, useContext} from 'react';
import {TableAction} from './actions';
import {TableColumn, Labelled, Seated, TableState, resting} from './table-state';
import {Direction} from './sorting';

export type TableView = {
  readonly state: TableState;
  readonly columns: readonly TableColumn<Labelled>[];
  readonly rows: readonly Seated[];
};

type Selector<Slice> = (view: TableView) => Slice;

export type TableContext = TableView & {
  readonly dispatch: Dispatch<TableAction>;
};

export const Table = createContext<TableContext>({state: resting, columns: [], rows: [], dispatch: () => undefined});

export const useTableSelector = <Slice>(select: Selector<Slice>): Slice => select(useContext(Table));

export const useTableDispatch = (): Dispatch<TableAction> => useContext(Table).dispatch;

type ColumnMoved = {readonly column: string; readonly to: number};
type RowMoved = {readonly row: string; readonly to: number; readonly standing: readonly string[]};
export type Sorted = {readonly column: string; readonly direction?: Direction};

export type HeaderEvents = {
  readonly onColumnMoved?: (moved: ColumnMoved) => void;
  readonly onSorted?: (sorted: Sorted) => void;
};

export type BodyEvents = {
  readonly onRowMoved?: (moved: RowMoved) => void;
};

export const Header = createContext<HeaderEvents>({});
export const Body = createContext<BodyEvents>({});

export const useHeaderEvents = (): HeaderEvents => useContext(Header);
export const useBodyEvents = (): BodyEvents => useContext(Body);

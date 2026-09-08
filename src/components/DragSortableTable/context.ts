import {Dispatch, createContext, useContext} from 'react';
import {TableAction} from './actions';
import {Labelled, Seated, TableState} from './table-state';

export type Selector<Slice> = (state: TableState<Labelled>, seated: readonly Seated[]) => Slice;

export type TableContext<C extends Labelled> = {
  state: TableState<C>;
  seated: readonly Seated[];
  dispatch: Dispatch<TableAction>;
};

export const Table = createContext<TableContext<Labelled>>({state: {columns: [], seats: []}, seated: [], dispatch: () => undefined});

export const useTableSelector = <Slice>(select: Selector<Slice>): Slice => {
  const {state, seated} = useContext(Table);
  return select(state, seated);
};

export const useTableDispatch = (): Dispatch<TableAction> => useContext(Table).dispatch;

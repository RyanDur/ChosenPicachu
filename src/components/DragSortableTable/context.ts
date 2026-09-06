import {createContext, useContext} from 'react';
import {TableState, TableStore, Transition, dealtTableState, tableStore} from './table-state';
import {Values} from './sorting';

export type {Transition};

export type Seat = {
  store: TableStore;
  values: readonly Values[];
};

export const Seated = createContext<Seat>({store: tableStore(dealtTableState([], 0)), values: []});

export const useStore = (): TableStore => useContext(Seated).store;
export const useValues = (): readonly Values[] => useContext(Seated).values;
export const useDispatch = (): ((transition: Transition) => void) => useContext(Seated).store.dispatch;

export type Showing = {
  state: TableState;
  standing: readonly number[];
};

export const Shown = createContext<Showing>({state: dealtTableState([], 0), standing: []});

export const useSelector = <Slice,>(select: (state: TableState) => Slice): Slice => select(useContext(Shown).state);
export const useStanding = (): readonly number[] => useContext(Shown).standing;

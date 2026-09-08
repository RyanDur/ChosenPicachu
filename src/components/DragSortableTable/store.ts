import {Middleware, Store, store} from '@components/store';
import {TableAction} from './actions';
import {tableReducer} from './reducer';
import {TableState} from './table-state';

export type TableStore<C> = Store<TableState<C>, TableAction>;

export type TableMiddleware<C> = Middleware<TableState<C>, TableAction>;

export const tableStore = <C>(initial: TableState<C>, ...middleware: TableMiddleware<C>[]): TableStore<C> =>
  store<TableState<C>, TableAction>({slice: {initial, reduce: tableReducer}, middleware});

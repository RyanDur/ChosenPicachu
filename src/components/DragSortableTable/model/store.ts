import {Middleware, Store, store} from '@components/store';
import {TableAction} from './actions';
import {TableState, resting} from './table-state';
import {tableReducer} from './reducer';

export type TableStore = Store<TableState, TableAction>;

export type TableMiddleware = Middleware<TableState, TableAction>;

export const tableStore = (...middleware: TableMiddleware[]): TableStore =>
  store({slice: {initial: resting, reduce: tableReducer}, middleware});

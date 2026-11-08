import {Dispatch, useContext} from 'react';
import {TableAction} from './model';
import {tableContexts} from './tableContexts';

export const useTableDispatch = (): Dispatch<TableAction> => useContext(tableContexts.State).dispatch;

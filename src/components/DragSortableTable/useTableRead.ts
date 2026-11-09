import {useContext} from 'react';
import {TableView} from './model';
import {tableContexts} from './tableContexts';

export const useTableRead = <Answer>(read: (view: TableView) => Answer): Answer =>
  read(useContext(tableContexts.State));

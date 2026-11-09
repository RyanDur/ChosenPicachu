import {useContext} from 'react';
import {TableView} from './model';
import {tableContexts} from './tableContexts';

export const useTableRead = <Slice>(read: (view: TableView) => Slice): Slice =>
  read(useContext(tableContexts.State));

import {useContext} from 'react';
import {TableView} from './model';
import {tableContexts} from './tableContexts';

export const useTableSelector = <Slice>(select: (view: TableView) => Slice): Slice =>
  select(useContext(tableContexts.State));

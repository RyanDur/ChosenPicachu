import {Dispatch, createContext} from 'react';
import {DragSort, dragSort} from './drag-sort';
import {DragSortChange} from './drag-sort-change';

export const dragSorting = createContext<[DragSort, Dispatch<DragSortChange>]>(
  [dragSort.initial({items: [], animated: false}), () => undefined]
);

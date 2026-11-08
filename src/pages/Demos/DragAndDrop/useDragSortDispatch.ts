import {Dispatch, useContext} from 'react';
import {DragSortChange} from './drag-sort-change';
import {dragSorting} from './drag-sorting';

export const useDragSortDispatch = (): Dispatch<DragSortChange> => useContext(dragSorting)[1];

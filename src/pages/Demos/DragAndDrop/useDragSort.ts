import {useContext} from 'react';
import {DragSort} from './drag-sort';
import {dragSorting} from './drag-sorting';

export const useDragSort = (): DragSort => useContext(dragSorting)[0];

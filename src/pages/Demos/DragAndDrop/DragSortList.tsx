import {FC} from 'react';
import {SortingList, SortingListProps} from './SortingList';
import {still} from './theater';

export const DragSortList: FC<SortingListProps> = props =>
  <SortingList {...props} theater={still}/>;

import {FC} from 'react';
import {SortingList, SortingListProps} from './SortingList';
import {staged} from './theater';

export const AnimatedDragSortList: FC<SortingListProps> = props =>
  <SortingList {...props} theater={staged}/>;

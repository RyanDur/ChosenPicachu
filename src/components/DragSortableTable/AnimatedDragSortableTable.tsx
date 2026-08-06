import {FC} from 'react';
import {SortingTable, SortingTableProps} from './SortingTable';
import {staged} from './theater';

export const AnimatedDragSortableTable: FC<SortingTableProps> = props =>
    <SortingTable {...props} theater={staged}/>;

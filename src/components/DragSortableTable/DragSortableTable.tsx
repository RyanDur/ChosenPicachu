import {FC} from 'react';
import {SortingTable, SortingTableProps} from './SortingTable';
import {still} from './theater';

export type DragSortableTableProps = SortingTableProps;

export const DragSortableTable: FC<DragSortableTableProps> = props =>
    <SortingTable {...props} theater={still}/>;

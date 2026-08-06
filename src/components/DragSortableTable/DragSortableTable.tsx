import {FC} from 'react';
import {TableProps} from '@components/Table';
import {DragStyle, eagerly, hides} from './travel';
import {EagerSortingTable} from './EagerSortingTable';
import {LazySortingTable} from './LazySortingTable';
import {still} from './theater';

export type DragSortableTableProps = TableProps & {
    dragStyle?: DragStyle;
    draggableColumns?: boolean;
    draggableRows?: boolean;
    sortable?: boolean;
};

export const DragSortableTable: FC<DragSortableTableProps> = (
    {dragStyle, draggableColumns = false, draggableRows = false, ...props}
) => eagerly(dragStyle)
    ? <EagerSortingTable {...props} hiding={hides(dragStyle)}
                         draggableColumns={draggableColumns} draggableRows={draggableRows} theater={still}/>
    : <LazySortingTable {...props} hiding={hides(dragStyle)}
                        draggableColumns={draggableColumns} draggableRows={draggableRows} theater={still}/>;

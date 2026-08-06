import {FC} from 'react';
import {DragSortableTableProps} from './DragSortableTable';
import {eagerly, hides} from './travel';
import {EagerSortingTable} from './EagerSortingTable';
import {LazySortingTable} from './LazySortingTable';
import {staged} from './theater';

export const AnimatedDragSortableTable: FC<DragSortableTableProps> = (
    {dragStyle, draggableColumns = false, draggableRows = false, ...props}
) => eagerly(dragStyle)
    ? <EagerSortingTable {...props} hiding={hides(dragStyle)}
                         draggableColumns={draggableColumns} draggableRows={draggableRows} theater={staged}/>
    : <LazySortingTable {...props} hiding={hides(dragStyle)}
                        draggableColumns={draggableColumns} draggableRows={draggableRows} theater={staged}/>;

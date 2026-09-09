import {ComponentProps, FC} from 'react';
import {has} from '@ryandur/sand';
import {classNames} from '@components/class-names';
import {useTableSelector} from '@components/DragSortableTable/context';
import {columnHeld, columnMarks, rowHeld, rowMarks} from '@components/DragSortableTable/selectors';
import {shoveDistance, shovedClass, translation} from '@components/DragSortableTable/table-state';
import './LazyKeepAnimatedTable.css';

export const Cell: FC<ComponentProps<'td'> & {column: string; row: string}> = ({column, row, className, children, ...td}) => {
  const {settlingFrom: columnFrom, shoved: columnShove} = useTableSelector(columnMarks(column));
  const {settlingFrom: rowFrom, shoved: rowShove} = useTableSelector(rowMarks(row));
  const columnCarried = useTableSelector(columnHeld(column));
  const rowCarried = useTableSelector(rowHeld(row));
  const from = columnFrom ?? rowFrom;
  const shove = columnShove ?? rowShove;

  return <td {...td}
             className={classNames(className, (columnCarried || rowCarried) && 'carried', has(from) && 'settling', shovedClass(shove))}
             style={{'--settling-from': translation(from), '--shoved-by': shoveDistance(shove)}}>
    {children}
  </td>;
};

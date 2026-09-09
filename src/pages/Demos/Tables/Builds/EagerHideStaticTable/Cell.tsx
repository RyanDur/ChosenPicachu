import {ComponentProps, FC} from 'react';
import {classNames} from '@components/class-names';
import {useTableSelector} from '@components/DragSortableTable/context';
import {columnHeld, offsetOfColumn, offsetOfRow, rowHeld} from '@components/DragSortableTable/selectors';
import {translation} from '@components/DragSortableTable/table-state';
import './EagerHideStaticTable.css';

export const Cell: FC<ComponentProps<'td'> & {column: string; row: string}> = ({column, row, className, children, ...td}) => {
  const columnCarried = useTableSelector(columnHeld(column));
  const rowCarried = useTableSelector(rowHeld(row));
  const columnOffset = useTableSelector(offsetOfColumn(column));
  const rowOffset = useTableSelector(offsetOfRow(row));

  return <td {...td}
             className={classNames(className, (columnCarried || rowCarried) && 'carried')}
             style={{'--carried-by': translation(columnOffset ?? rowOffset)}}>
    {children}
  </td>;
};

import {ComponentProps, FC} from 'react';
import {classNames} from '@components/class-names';
import {useTableSelector} from '@components/DragSortableTable/context';
import {columnNamed, offsetOfColumn, offsetOfRow, rowAt} from '@components/DragSortableTable/selectors';
import {translation} from '@components/DragSortableTable/table-state';
import './LazyHideStaticTable.css';

export const Cell: FC<ComponentProps<'td'> & {column: string; row: string}> = ({column, row: seat, className, children, ...td}) => {
  const {carried: columnCarried} = useTableSelector(columnNamed(column));
  const {carried: rowCarried} = useTableSelector(rowAt(seat));
  const columnOffset = useTableSelector(offsetOfColumn(column));
  const rowOffset = useTableSelector(offsetOfRow(seat));

  return <td {...td}
             className={classNames(className, (columnCarried || rowCarried) && 'carried')}
             style={{'--carried-by': translation(columnOffset ?? rowOffset)}}>
    {children}
  </td>;
};

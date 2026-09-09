import {ComponentProps, FC} from 'react';
import {has} from '@ryandur/sand';
import {classNames} from '@components/class-names';
import {shareWidth} from '@components/Table';
import {useTableSelector} from '@components/DragSortableTable/context';
import {columnNamed, widthOfColumn} from '@components/DragSortableTable/selectors';
import '@components/DragSortableTable/Header.css';

export const Column: FC<ComponentProps<'th'> & {column: string}> = ({column, className, children, ...th}) => {
  const {sorted, data} = useTableSelector(columnNamed(column));
  const width = useTableSelector(widthOfColumn(column));

  return <th {...th}
             className={classNames(className, has(width) && 'shared')}
             scope="col"
             aria-label={data.label}
             aria-sort={sorted}
             style={{'--share': shareWidth(width)}}>
    {children}
  </th>;
};

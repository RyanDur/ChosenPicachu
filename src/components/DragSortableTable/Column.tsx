import {ComponentProps, FC} from 'react';
import {classNames} from '@components/class-names';
import {shareWidth} from '@components/Table';
import {useTableSelector} from './context';
import {headerCell, headerNeeds, tableSelectors} from './model';
import './Header.css';

export const Column: FC<ComponentProps<'th'> & {column: string}> = ({column, className, children, ...th}) => {
  const {sorted, data} = useTableSelector(tableSelectors.columnNamed(column))
    .orElse(tableSelectors.unknownColumn(column));
  const width = useTableSelector(tableSelectors.widthOfColumn(column));

  return <th {...th}
    className={classNames(...headerCell, className, ...headerNeeds(false, width))}
    scope="col"
    aria-label={data.label}
    aria-sort={sorted}
    style={{'--share': shareWidth(width)}}>
    {children}
  </th>;
};

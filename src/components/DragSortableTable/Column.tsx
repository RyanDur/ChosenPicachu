import {ComponentProps, FC} from 'react';
import {classNames} from '../classNames';
import {useTableRead} from './useTableRead';
import {looks, shares, tableReads} from './model';
import './Header.css';

export const Column: FC<ComponentProps<'th'> & {column: string}> = ({column, className, children, ...th}) => {
  const {sorted, data} = useTableRead(tableReads.columnNamed(column))
    .orElse(tableReads.unknownColumn(column));
  const width = useTableRead(tableReads.widthOfColumn(column));

  return <th {...th}
    className={classNames(...looks.headerCell, className, ...looks.headerNeeds(false, width))}
    scope="col"
    aria-label={data.label}
    aria-sort={sorted}
    style={{'--share': shares.width(width)}}>
    {children}
  </th>;
};

import {ComponentProps, FC} from 'react';
import {classNames} from '../classNames';
import {useTableSelector} from './useTableSelector';
import {looks, shares, tableSelectors} from './model';
import './Header.css';

export const Column: FC<ComponentProps<'th'> & {column: string}> = ({column, className, children, ...th}) => {
  const {sorted, data} = useTableSelector(tableSelectors.columnNamed(column))
    .orElse(tableSelectors.unknownColumn(column));
  const width = useTableSelector(tableSelectors.widthOfColumn(column));

  return <th {...th}
    className={classNames(...looks.headerCell, className, ...looks.headerNeeds(false, width))}
    scope="col"
    aria-label={data.label}
    aria-sort={sorted}
    style={{'--share': shares.width(width)}}>
    {children}
  </th>;
};

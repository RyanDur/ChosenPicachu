import {ComponentProps, FC} from 'react';
import {classNames} from '@components/class-names';
import {shares} from '@components/Table';
import {useTableSelector} from './context';
import {tableSelectors, looks} from './model';
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

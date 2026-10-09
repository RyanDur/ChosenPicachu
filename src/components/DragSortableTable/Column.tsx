import {ComponentProps, FC} from 'react';
import {classNames} from '@components/class-names';
import {shareWidth} from '@components/Table/shares';
import {useTableSelector} from './context';
import {columnNamed, unknownColumn, widthOfColumn} from './selectors';
import './Header.css';
import {headerCell, headerLooks, headerStates} from './looks';

export const Column: FC<ComponentProps<'th'> & {column: string}> = ({column, className, children, ...th}) => {
  const {sorted, data} = useTableSelector(columnNamed(column)).orElse(unknownColumn(column));
  const width = useTableSelector(widthOfColumn(column));

  return <th {...th}
    className={classNames(...headerCell, className, ...headerLooks, ...headerStates(false, width))}
    scope="col"
    aria-label={data.label}
    aria-sort={sorted}
    style={{'--share': shareWidth(width)}}>
    {children}
  </th>;
};

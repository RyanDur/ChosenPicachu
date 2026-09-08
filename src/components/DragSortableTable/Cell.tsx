import {ComponentProps, FC} from 'react';
import {has} from '@ryandur/sand';
import {classNames} from '@components/class-names';
import {useTableSelector} from './context';
import {columnNamed, offsetOfColumn, offsetOfRow, rowAt} from './selectors';
import {shoveDistance, shovedClass, translation} from './table-state';
import './motion.css';

export const Cell: FC<ComponentProps<'td'> & {column: string; row: string}> = ({column, row: seat, className, children, ...td}) => {
  const {carried: columnCarried, settlingFrom: columnFrom, shoved: columnShove} = useTableSelector(columnNamed(column));
  const {carried: rowCarried, settlingFrom: rowFrom, shoved: rowShove} = useTableSelector(rowAt(seat));
  const columnOffset = useTableSelector(offsetOfColumn(column));
  const rowOffset = useTableSelector(offsetOfRow(seat));
  const from = columnFrom ?? rowFrom;
  const shove = columnShove ?? rowShove;

  return <td {...td}
             className={classNames(className, (columnCarried || rowCarried) && 'carried', has(from) && 'settling', shovedClass(shove))}
             style={{'--carried-by': translation(columnOffset ?? rowOffset), '--settling-from': translation(from), '--shoved-by': shoveDistance(shove)}}>
    {children}
  </td>;
};

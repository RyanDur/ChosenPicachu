import {ComponentProps, FC} from 'react';
import {has} from '@ryandur/sand';
import {classNames} from '@components/class-names';
import {useTableSelector} from './context';
import {columnHeld, columnMarks, offsetOfColumn, offsetOfRow, rowHeld, rowMarks} from './selectors';
import {shoveDistance, shovedClass, translation} from './table-state';
import './motion.css';

export const Cell: FC<ComponentProps<'td'> & {column: string; row: string}> = ({column, row, className, children, ...td}) => {
  const {settlingFrom: columnFrom, shoved: columnShove} = useTableSelector(columnMarks(column));
  const {settlingFrom: rowFrom, shoved: rowShove} = useTableSelector(rowMarks(row));
  const columnCarried = useTableSelector(columnHeld(column));
  const rowCarried = useTableSelector(rowHeld(row));
  const columnOffset = useTableSelector(offsetOfColumn(column));
  const rowOffset = useTableSelector(offsetOfRow(row));
  const from = columnFrom ?? rowFrom;
  const shove = columnShove ?? rowShove;

  return <td {...td}
             className={classNames(className, (columnCarried || rowCarried) && 'carried', has(from) && 'settling', shovedClass(shove))}
             style={{'--carried-by': translation(columnOffset ?? rowOffset), '--settling-from': translation(from), '--shoved-by': shoveDistance(shove)}}>
    {children}
  </td>;
};

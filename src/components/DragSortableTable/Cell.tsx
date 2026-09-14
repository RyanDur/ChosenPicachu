import {ComponentProps, FC} from 'react';
import {has} from '@ryandur/sand';
import {classNames} from '@components/class-names';
import {useTableSelector} from './context';
import {columnHeld, columnMarks, driftOfColumn, driftOfRow, rowHeld, rowMarks, seatOfColumn, seatOfRow} from './selectors';
import {pixels, shoveDistance, shovedClass} from './table-state';
import './motion.css';

export const Cell: FC<ComponentProps<'td'> & {column: string; row: string}> = ({column, row, className, children, ...td}) => {
  const {settlingFrom: columnFrom, shoved: columnShove} = useTableSelector(columnMarks(column));
  const {settlingFrom: rowFrom, shoved: rowShove} = useTableSelector(rowMarks(row));
  const columnCarried = useTableSelector(columnHeld(column));
  const rowCarried = useTableSelector(rowHeld(row));
  const columnSeat = useTableSelector(seatOfColumn(column));
  const rowSeat = useTableSelector(seatOfRow(row));
  const columnDrift = useTableSelector(driftOfColumn(column));
  const rowDrift = useTableSelector(driftOfRow(row));
  const seat = columnSeat ?? rowSeat;
  const drift = columnDrift ?? rowDrift;
  const from = columnFrom ?? rowFrom;
  const shove = columnShove ?? rowShove;

  return <td {...td}
    className={classNames(className, (columnCarried || rowCarried) && 'carried', has(from) && 'settling', shovedClass(shove))}
    style={{
      '--seat-x': pixels(seat?.x), '--seat-y': pixels(seat?.y),
      '--drift-x': pixels(drift?.x), '--drift-y': pixels(drift?.y),
      '--settle-x': pixels(from?.seat.x), '--settle-y': pixels(from?.seat.y),
      '--settle-drift-x': pixels(from?.drift.x), '--settle-drift-y': pixels(from?.drift.y),
      '--shoved-by': shoveDistance(shove)
    }}>
    {children}
  </td>;
};

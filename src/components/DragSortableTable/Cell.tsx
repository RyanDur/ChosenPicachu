import {ComponentProps, FC} from 'react';
import {classNames} from '../classNames';
import {useTableRead} from './useTableRead';
import {tableReads, looks} from './model';
import './motion.css';

export const Cell: FC<ComponentProps<'td'> & {column: string; row: string}> = ({column, row, className, children, ...td}) => {
  const {settlingFrom: columnFrom, shoved: columnShove} = useTableRead(tableReads.columnMarks(column));
  const {settlingFrom: rowFrom, shoved: rowShove} = useTableRead(tableReads.rowMarks(row));
  const columnCarried = useTableRead(tableReads.columnHeld(column));
  const rowCarried = useTableRead(tableReads.rowHeld(row));
  const columnSeat = useTableRead(tableReads.seatOfColumn(column));
  const rowSeat = useTableRead(tableReads.seatOfRow(row));
  const columnDrift = useTableRead(tableReads.driftOfColumn(column));
  const rowDrift = useTableRead(tableReads.driftOfRow(row));
  const seat = columnSeat ?? rowSeat;
  const drift = columnDrift ?? rowDrift;
  const from = columnFrom ?? rowFrom;
  const shove = columnShove ?? rowShove;

  return <td {...td}
    className={classNames('cell', className, ...looks.cellNeeds, ...looks.motionStates(columnCarried || rowCarried, from, shove))}
    style={{
      '--seat-x': looks.pixels(seat?.x), '--seat-y': looks.pixels(seat?.y),
      '--drift-x': looks.pixels(drift?.x), '--drift-y': looks.pixels(drift?.y),
      '--settle-x': looks.pixels(from?.seat.x), '--settle-y': looks.pixels(from?.seat.y),
      '--settle-drift-x': looks.pixels(from?.drift.x), '--settle-drift-y': looks.pixels(from?.drift.y),
      '--shoved-by': looks.shoveDistance(shove)
    }}>
    {children}
  </td>;
};

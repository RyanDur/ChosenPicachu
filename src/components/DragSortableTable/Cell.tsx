import {ComponentProps, FC} from 'react';
import {classNames} from '@components/class-names';
import {useTableSelector} from './context';
import {cellNeeds, motionStates, pixels, shoveDistance, tableSelectors} from './model';
import './motion.css';

export const Cell: FC<ComponentProps<'td'> & {column: string; row: string}> = ({column, row, className, children, ...td}) => {
  const {settlingFrom: columnFrom, shoved: columnShove} = useTableSelector(tableSelectors.columnMarks(column));
  const {settlingFrom: rowFrom, shoved: rowShove} = useTableSelector(tableSelectors.rowMarks(row));
  const columnCarried = useTableSelector(tableSelectors.columnHeld(column));
  const rowCarried = useTableSelector(tableSelectors.rowHeld(row));
  const columnSeat = useTableSelector(tableSelectors.seatOfColumn(column));
  const rowSeat = useTableSelector(tableSelectors.seatOfRow(row));
  const columnDrift = useTableSelector(tableSelectors.driftOfColumn(column));
  const rowDrift = useTableSelector(tableSelectors.driftOfRow(row));
  const seat = columnSeat ?? rowSeat;
  const drift = columnDrift ?? rowDrift;
  const from = columnFrom ?? rowFrom;
  const shove = columnShove ?? rowShove;

  return <td {...td}
    className={classNames('cell', className, ...cellNeeds, ...motionStates(columnCarried || rowCarried, from, shove))}
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

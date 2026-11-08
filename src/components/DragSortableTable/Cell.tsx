import {ComponentProps, FC} from 'react';
import {classNames} from '@components/class-names';
import {useTableSelector} from './context';
import {tableSelectors, looks} from './model';
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

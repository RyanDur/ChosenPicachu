import {ComponentProps, FC, useState} from 'react';
import {has} from '@ryandur/sand';
import {classNames} from '@components/class-names';
import {Landed} from './report';
import {MoveReport} from './MoveReport';
import {useBodyEvents, useTableDispatch, useTableSelector} from './context';
import {columnHeld, driftOfColumn, driftOfRow, positionOfRow, rowDrag, rowHeld, rowMarks, seatOfColumn, seatOfRow, selectOrder, selectRowCount, selectStanding, settlingOfRowIn} from './selectors';
import {rowUnder, Survey} from './survey';
import {RowGrip} from './RowGrip';
import {RowDrag, pixels, shoveDistance, shovedClass} from './table-state';
import {lifted, drifted, dropped, rowMovedBeside, rowWalkedTo, settled} from './actions';
import {Moving, eagerTravel, pointerTravel} from './travel';
import {Grab, rowLift} from './lift';
import {rowArrows} from './arrows';
import './motion.css';

export const RowHeader: FC<ComponentProps<'th'> & {column: string; row: string; label: string}> = ({column, row, label, className, ...th}) => {
  const dispatch = useTableDispatch();
  const {onRowMoved} = useBodyEvents();
  const order = useTableSelector(selectOrder);
  const columnCarried = useTableSelector(columnHeld(column));
  const carried = useTableSelector(rowHeld(row));
  const {settlingFrom, shoved} = useTableSelector(rowMarks(row));
  const standing = useTableSelector(selectStanding);
  const position = useTableSelector(positionOfRow(row));
  const count = useTableSelector(selectRowCount);
  const drag = useTableSelector(rowDrag(row));
  const columnSeat = useTableSelector(seatOfColumn(column));
  const rowSeat = useTableSelector(seatOfRow(row));
  const columnDrift = useTableSelector(driftOfColumn(column));
  const rowDrift = useTableSelector(driftOfRow(row));
  const settling = useTableSelector(settlingOfRowIn(row, standing));
  const [landed, setLanded] = useState<Landed>();
  const seat = columnSeat ?? rowSeat;
  const drift = columnDrift ?? rowDrift;

  const nudgedTo = (to: number, heights: Readonly<Record<string, number>>): void => dispatch(rowWalkedTo(row, to, heights, standing));
  const walkedTo = (to: number): void => {
    onRowMoved?.({row, to, standing});
    setLanded({axis: 'row', position: to, of: count});
  };
  const beside = (neighbour: string, survey: Survey): void => {
    const to = standing.indexOf(neighbour);
    dispatch(rowMovedBeside(row, neighbour, survey.rowHeights, standing));
    onRowMoved?.({row, to, standing});
    setLanded({axis: 'row', position: to, of: count});
  };

  const lift = (grab: Grab): void => dispatch(lifted({axis: 'row', held: row}, grab));
  const moved = (held: RowDrag) => (moving: Moving): void => {
    dispatch(drifted(moving));
    eagerTravel(rowUnder(standing, held.survey), row, neighbour => beside(neighbour, held.survey))(moving);
  };
  const release = (): void => {
    if (has(drag) && has(settling)) {
      dispatch(dropped({axis: 'row', held: row}, settling));
    }
  };

  return <th {...th} scope="row" aria-label={label}
    onAnimationEnd={() => dispatch(settled({axis: 'row', held: row}))}
    className={classNames(className, (columnCarried || carried) && 'carried', has(settlingFrom) && 'settling', shovedClass(shoved))}
    style={{
      '--seat-x': pixels(seat?.x), '--seat-y': pixels(seat?.y),
      '--drift-x': pixels(drift?.x), '--drift-y': pixels(drift?.y),
      '--settle-x': pixels(settlingFrom?.seat.x), '--settle-y': pixels(settlingFrom?.seat.y),
      '--settle-drift-x': pixels(settlingFrom?.drift.x), '--settle-drift-y': pixels(settlingFrom?.drift.y),
      '--shoved-by': shoveDistance(shoved)
    }}>
    <RowGrip position={position}
      onPointerDown={rowLift(() => order, () => standing, lift)}
      onPointerMove={has(drag) ? pointerTravel(moved(drag), release) : undefined}
      onPointerUp={has(drag) ? release : undefined}
      onPointerCancel={has(drag) ? release : undefined}
      onLostPointerCapture={has(drag) ? pointerTravel(moved(drag), release) : undefined}
      onKeyDown={rowArrows(row, () => standing, {nudged: ({to, heights}) => nudgedTo(to, heights), moved: ({to}) => walkedTo(to)})}/>
    {label}
    <MoveReport landed={landed}/>
  </th>;
};

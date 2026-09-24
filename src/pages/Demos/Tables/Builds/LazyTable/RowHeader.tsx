import {ComponentProps, FC} from 'react';
import {has} from '@ryandur/sand';
import {classNames} from '@components/class-names';
import {useBodyEvents, useTableDispatch, useTableSelector} from '@components/DragSortableTable/context';
import {columnHeld, driftOfColumn, driftOfRow, positionOfRow, rowDrag, rowHeld, rowMarks, seatOfColumn, seatOfRow, selectOrder, selectStanding, settlingOfRowIn} from '@components/DragSortableTable/selectors';
import {Survey} from '@components/DragSortableTable/survey';
import {RowGrip} from '@components/DragSortableTable/RowGrip';
import {RowDrag, pixels, shoveDistance, shovedClass} from '@components/DragSortableTable/table-state';
import {lifted, drifted, dropped, rowLandingFound, rowMovedBeside, rowWalkedTo, settled} from '@components/DragSortableTable/actions';
import {Moving, pointerTravel} from '@components/DragSortableTable/travel';
import {movedTo} from '@components/DragSortableTable/arrangement';
import {releasedRow, travelledRow} from './travel';
import {Grab, rowLift} from '@components/DragSortableTable/lift';
import {rowArrows} from '@components/DragSortableTable/arrows';
import '@components/DragSortableTable/motion.css';

export const RowHeader: FC<ComponentProps<'th'> & {column: string; row: string; label: string}> = ({column, row, label, className, ...th}) => {
  const dispatch = useTableDispatch();
  const {onRowMoved} = useBodyEvents();
  const order = useTableSelector(selectOrder);
  const columnCarried = useTableSelector(columnHeld(column));
  const carried = useTableSelector(rowHeld(row));
  const {settlingFrom, shoved} = useTableSelector(rowMarks(row));
  const standing = useTableSelector(selectStanding);
  const position = useTableSelector(positionOfRow(row));
  const drag = useTableSelector(rowDrag(row));
  const columnSeat = useTableSelector(seatOfColumn(column));
  const rowSeat = useTableSelector(seatOfRow(row));
  const columnDrift = useTableSelector(driftOfColumn(column));
  const rowDrift = useTableSelector(driftOfRow(row));
  const view = useTableSelector(whole => whole);
  const seat = columnSeat ?? rowSeat;
  const drift = columnDrift ?? rowDrift;

  const nudged = (to: number, heights: Readonly<Record<string, number>>): void => dispatch(rowWalkedTo({key: row, label}, to, heights, standing));
  const arrived = (to: number): void => onRowMoved?.({row, to, standing});
  const beside = (neighbour: string, survey: Survey): void => {
    const to = standing.indexOf(neighbour);
    dispatch(rowMovedBeside({key: row, label}, neighbour, survey.rowHeights, standing));
    onRowMoved?.({row, to, standing});
  };

  const lift = (grab: Grab): void => dispatch(lifted({axis: 'row', held: row}, grab));
  const moved = (held: RowDrag) => (moving: Moving): void => {
    dispatch(drifted(moving));
    dispatch(rowLandingFound(travelledRow(standing, moving)(held)));
  };
  const release = (): void => {
    if (has(drag)) {
      const to = has(drag.landing) ? standing.indexOf(drag.landing) : standing.indexOf(row);
      const settling = settlingOfRowIn(row, movedTo(standing, row, to))(view);
      releasedRow(drag, neighbour => beside(neighbour, drag.survey));
      if (has(settling)) {
        dispatch(dropped({axis: 'row', held: row}, settling));
      }
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
      onKeyDown={rowArrows(row, () => standing, {nudged: ({to, heights}) => nudged(to, heights), moved: ({to}) => arrived(to)})}/>
    {label}
  </th>;
};

import {ComponentProps, FC} from 'react';
import {has} from '@ryandur/sand';
import {classNames} from '@components/class-names';
import {RowGrip, useBodyEvents, useTableDispatch, useTableSelector} from '@components/DragSortableTable';
import {Grab, Moving, PixelSizes, arrows, RowDrag, Survey, tableActions, tableSelectors, looks, travel, arrangements, lifting} from '@components/DragSortableTable/model';
import {lazyDrop} from './lazyDrop';
import '@components/DragSortableTable/motion.css';

export const RowHeader: FC<ComponentProps<'th'> & {column: string; row: string; label: string}> = ({column, row, label, className, ...th}) => {
  const dispatch = useTableDispatch();
  const {onRowMoved} = useBodyEvents();
  const order = useTableSelector(tableSelectors.order);
  const columnCarried = useTableSelector(tableSelectors.columnHeld(column));
  const carried = useTableSelector(tableSelectors.rowHeld(row));
  const {settlingFrom, shoved} = useTableSelector(tableSelectors.rowMarks(row));
  const standing = useTableSelector(tableSelectors.standing);
  const position = useTableSelector(tableSelectors.positionOfRow(row));
  const drag = useTableSelector(tableSelectors.rowDrag(row));
  const columnSeat = useTableSelector(tableSelectors.seatOfColumn(column));
  const rowSeat = useTableSelector(tableSelectors.seatOfRow(row));
  const columnDrift = useTableSelector(tableSelectors.driftOfColumn(column));
  const rowDrift = useTableSelector(tableSelectors.driftOfRow(row));
  const view = useTableSelector(whole => whole);
  const seat = columnSeat ?? rowSeat;
  const drift = columnDrift ?? rowDrift;

  const nudged = (to: number, heights: PixelSizes): void =>
    dispatch(tableActions.rowWalkedTo({row, label}, to, heights, standing));
  const arrived = (to: number): void => onRowMoved?.({row, to, standing});
  const beside = (neighbour: string, bounds: Survey): void => {
    const to = standing.indexOf(neighbour);
    dispatch(tableActions.rowMovedBeside({row, label}, neighbour, bounds.rowHeights, standing));
    onRowMoved?.({row, to, standing});
  };

  const lift = (grab: Grab): void => dispatch(tableActions.lifted({axis: 'row', held: row}, grab));
  const moved = (held: RowDrag) => (moving: Moving): void => {
    dispatch(tableActions.drifted(moving));
    dispatch(tableActions.rowLandingFound(lazyDrop.row(standing, moving)(held)));
  };
  const release = (): void => {
    if (has(drag)) {
      const to = has(drag.landing) ? standing.indexOf(drag.landing) : standing.indexOf(row);
      const settling = tableSelectors.settlingOfRowIn(row, arrangements.movedTo(standing, row, to))(view);
      lazyDrop.released(drag, neighbour => beside(neighbour, drag.survey));
      if (has(settling)) {
        dispatch(tableActions.dropped({axis: 'row', held: row}, settling, {name: label, order: arrangements.movedTo(standing, row, to)}));
      }
    }
  };

  return <th {...th} scope="row" aria-label={label}
    onAnimationEnd={() => dispatch(tableActions.settled({axis: 'row', held: row}))}
    className={classNames(
      ...looks.rowHeaderCell, className, ...looks.cellNeeds,
      ...looks.motionStates(columnCarried || carried, settlingFrom, shoved))}
    style={{
      '--seat-x': looks.pixels(seat?.x), '--seat-y': looks.pixels(seat?.y),
      '--drift-x': looks.pixels(drift?.x), '--drift-y': looks.pixels(drift?.y),
      '--settle-x': looks.pixels(settlingFrom?.seat.x), '--settle-y': looks.pixels(settlingFrom?.seat.y),
      '--settle-drift-x': looks.pixels(settlingFrom?.drift.x), '--settle-drift-y': looks.pixels(settlingFrom?.drift.y),
      '--shoved-by': looks.shoveDistance(shoved)
    }}>
    <RowGrip position={position}
      onPointerDown={lifting.row(() => order, () => standing, lift)}
      onPointerMove={has(drag) ? travel.pointer(moved(drag), release) : undefined}
      onPointerUp={has(drag) ? release : undefined}
      onPointerCancel={has(drag) ? release : undefined}
      onLostPointerCapture={has(drag) ? travel.pointer(moved(drag), release) : undefined}
      onKeyDown={arrows.row(row, () => standing, {
        nudged: ({to, heights}) => nudged(to, heights),
        moved: ({to}) => arrived(to)
      })}/>
    {label}
  </th>;
};

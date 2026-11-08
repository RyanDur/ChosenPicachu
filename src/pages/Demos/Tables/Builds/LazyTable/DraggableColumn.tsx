import {ComponentProps, FC} from 'react';
import {has} from '@ryandur/sand';
import {classNames} from '@components/class-names';
import {shareWidth} from '@components/Table';
import {useHeaderEvents, useTableDispatch, useTableSelector} from '@components/DragSortableTable';
import {arrows, ColumnDrag, columnLift, Grab, headerCell, headerNeeds, interior, motionStates, movedTo, Moving, pixels, PixelSizes, pointerTravel, shoveDistance, Survey, tableActions, tableSelectors} from '@components/DragSortableTable/model';
import {releasedColumn, travelledColumn} from './travel';
import '@components/DragSortableTable/Header.css';
import '@components/DragSortableTable/motion.css';

export const DraggableColumn: FC<ComponentProps<'th'> & {column: string}> = ({column, className, children, ...th}) => {
  const dispatch = useTableDispatch();
  const {onColumnMoved} = useHeaderEvents();
  const order = useTableSelector(tableSelectors.selectOrder);
  const standing = useTableSelector(tableSelectors.selectStanding);
  const {sorted, data} = useTableSelector(tableSelectors.columnNamed(column))
    .orElse(tableSelectors.unknownColumn(column));
  const width = useTableSelector(tableSelectors.widthOfColumn(column));
  const {settlingFrom, shoved} = useTableSelector(tableSelectors.columnMarks(column));
  const carried = useTableSelector(tableSelectors.columnHeld(column));
  const drag = useTableSelector(tableSelectors.columnDrag(column));
  const seat = useTableSelector(tableSelectors.seatOfColumn(column));
  const drift = useTableSelector(tableSelectors.driftOfColumn(column));
  const view = useTableSelector(whole => whole);
  const count = useTableSelector(tableSelectors.selectColumnCount);
  const travels = useTableSelector(tableSelectors.columnTravels(column));

  const walkedTo = (to: number, widths: PixelSizes): void => {
    dispatch(tableActions.columnWalkedTo(column, to, widths, order));
    onColumnMoved?.({column, to});
  };
  const beside = (neighbour: string, survey: Survey): void => {
    const to = interior(order.indexOf(neighbour), count);
    dispatch(tableActions.columnMovedBeside(column, neighbour, survey.columnWidths, order));
    onColumnMoved?.({column, to});
  };

  const lift = (grab: Grab): void => dispatch(tableActions.lifted({axis: 'column', held: column}, grab));
  const moved = (held: ColumnDrag) => (moving: Moving): void => {
    dispatch(tableActions.drifted(moving));
    dispatch(tableActions.columnLandingFound(travelledColumn(order, moving)(held)));
  };
  const release = (): void => {
    if (has(drag)) {
      const to = has(drag.landing) ? interior(order.indexOf(drag.landing), count) : order.indexOf(column);
      const settling = tableSelectors.settlingOfColumnIn(column, movedTo(order, column, to))(view);
      releasedColumn(drag, neighbour => beside(neighbour, drag.survey));
      if (has(settling)) {
        dispatch(tableActions.dropped({axis: 'column', held: column}, settling, {name: column, order: movedTo(order, column, to)}));
      }
    }
  };

  return <th {...th}
    className={classNames(
      ...headerCell, className, ...headerNeeds(travels, width), ...motionStates(carried, settlingFrom, shoved))}
    scope="col"
    aria-label={data.label}
    aria-sort={sorted}
    tabIndex={travels ? 0 : undefined}
    onPointerDown={travels ? columnLift(column, () => order, () => standing, lift) : undefined}
    onPointerMove={has(drag) ? pointerTravel(moved(drag), release) : undefined}
    onPointerUp={has(drag) ? release : undefined}
    onPointerCancel={has(drag) ? release : undefined}
    onLostPointerCapture={has(drag) ? pointerTravel(moved(drag), release) : undefined}
    onKeyDown={travels ? arrows.column(column, () => order, ({to, widths}) => walkedTo(to, widths)) : undefined}
    onAnimationEnd={() => dispatch(tableActions.settled({axis: 'column', held: column}))}
    style={{
      '--share': shareWidth(width),
      '--seat-x': pixels(seat?.x), '--seat-y': pixels(seat?.y),
      '--drift-x': pixels(drift?.x), '--drift-y': pixels(drift?.y),
      '--settle-x': pixels(settlingFrom?.seat.x), '--settle-y': pixels(settlingFrom?.seat.y),
      '--settle-drift-x': pixels(settlingFrom?.drift.x), '--settle-drift-y': pixels(settlingFrom?.drift.y),
      '--shoved-by': shoveDistance(shoved)
    }}>
    {children}
  </th>;
};

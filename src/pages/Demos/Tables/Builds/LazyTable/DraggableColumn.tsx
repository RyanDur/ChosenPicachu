import {ComponentProps, FC} from 'react';
import {has} from '@ryandur/sand';
import {classNames} from '@components';
import {shares} from '@components';
import {useHeaderEvents, useTableDispatch, useTableSelector} from '@components/DragSortableTable';
import {arrows, ColumnDrag, Grab, Moving, PixelSizes, Survey, tableActions, tableSelectors, survey, looks, travel, arrangements, lifting} from '@components/DragSortableTable/model';
import {lazyDrop} from './lazyDrop';
import '@components/DragSortableTable/Header.css';
import '@components/DragSortableTable/motion.css';

export const DraggableColumn: FC<ComponentProps<'th'> & {column: string}> = ({column, className, children, ...th}) => {
  const dispatch = useTableDispatch();
  const {onColumnMoved} = useHeaderEvents();
  const order = useTableSelector(tableSelectors.order);
  const standing = useTableSelector(tableSelectors.standing);
  const {sorted, data} = useTableSelector(tableSelectors.columnNamed(column))
    .orElse(tableSelectors.unknownColumn(column));
  const width = useTableSelector(tableSelectors.widthOfColumn(column));
  const {settlingFrom, shoved} = useTableSelector(tableSelectors.columnMarks(column));
  const carried = useTableSelector(tableSelectors.columnHeld(column));
  const drag = useTableSelector(tableSelectors.columnDrag(column));
  const seat = useTableSelector(tableSelectors.seatOfColumn(column));
  const drift = useTableSelector(tableSelectors.driftOfColumn(column));
  const view = useTableSelector(whole => whole);
  const count = useTableSelector(tableSelectors.columnCount);
  const travels = useTableSelector(tableSelectors.columnTravels(column));

  const walkedTo = (to: number, widths: PixelSizes): void => {
    dispatch(tableActions.columnWalkedTo(column, to, widths, order));
    onColumnMoved?.({column, to});
  };
  const beside = (neighbour: string, bounds: Survey): void => {
    const to = survey.interior(order.indexOf(neighbour), count);
    dispatch(tableActions.columnMovedBeside(column, neighbour, bounds.columnWidths, order));
    onColumnMoved?.({column, to});
  };

  const lift = (grab: Grab): void => dispatch(tableActions.lifted({axis: 'column', held: column}, grab));
  const moved = (held: ColumnDrag) => (moving: Moving): void => {
    dispatch(tableActions.drifted(moving));
    dispatch(tableActions.columnLandingFound(lazyDrop.column(order, moving)(held)));
  };
  const release = (): void => {
    if (has(drag)) {
      const to = has(drag.landing) ? survey.interior(order.indexOf(drag.landing), count) : order.indexOf(column);
      const settling = tableSelectors.settlingOfColumnIn(column, arrangements.movedTo(order, column, to))(view);
      lazyDrop.released(drag, neighbour => beside(neighbour, drag.survey));
      if (has(settling)) {
        dispatch(tableActions.dropped({axis: 'column', held: column}, settling, {name: column, order: arrangements.movedTo(order, column, to)}));
      }
    }
  };

  return <th {...th}
    className={classNames(
      ...looks.headerCell, className, ...looks.headerNeeds(travels, width),
      ...looks.motionStates(carried, settlingFrom, shoved))}
    scope="col"
    aria-label={data.label}
    aria-sort={sorted}
    tabIndex={travels ? 0 : undefined}
    onPointerDown={travels ? lifting.column(column, () => order, () => standing, lift) : undefined}
    onPointerMove={has(drag) ? travel.pointer(moved(drag), release) : undefined}
    onPointerUp={has(drag) ? release : undefined}
    onPointerCancel={has(drag) ? release : undefined}
    onLostPointerCapture={has(drag) ? travel.pointer(moved(drag), release) : undefined}
    onKeyDown={travels ? arrows.column(column, () => order, ({to, widths}) => walkedTo(to, widths)) : undefined}
    onAnimationEnd={() => dispatch(tableActions.settled({axis: 'column', held: column}))}
    style={{
      '--share': shares.width(width),
      '--seat-x': looks.pixels(seat?.x), '--seat-y': looks.pixels(seat?.y),
      '--drift-x': looks.pixels(drift?.x), '--drift-y': looks.pixels(drift?.y),
      '--settle-x': looks.pixels(settlingFrom?.seat.x), '--settle-y': looks.pixels(settlingFrom?.seat.y),
      '--settle-drift-x': looks.pixels(settlingFrom?.drift.x), '--settle-drift-y': looks.pixels(settlingFrom?.drift.y),
      '--shoved-by': looks.shoveDistance(shoved)
    }}>
    {children}
  </th>;
};

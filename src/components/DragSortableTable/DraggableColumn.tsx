import {ComponentProps, FC} from 'react';
import {has} from '@ryandur/sand';
import {classNames} from '@components/class-names';
import {shareWidth} from '@components/Table';
import {useHeaderEvents, useTableDispatch, useTableSelector} from './context';
import {arrows, ColumnDrag, columnLift, eagerTravel, Grab, headerCell, headerNeeds, motionStates, Moving, PixelSizes, pointerTravel, Survey, tableActions, tableSelectors, tableState, survey} from './model';
import './Header.css';
import './motion.css';

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
  const settling = useTableSelector(tableSelectors.settlingOfColumnIn(column, order));
  const count = useTableSelector(tableSelectors.selectColumnCount);
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
    eagerTravel(survey.columnUnder(order, held.survey), column, neighbour => beside(neighbour, held.survey))(moving);
  };
  const release = (): void => {
    if (has(drag) && has(settling)) {
      dispatch(tableActions.dropped({axis: 'column', held: column}, settling, {name: column, order}));
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
      '--seat-x': tableState.pixels(seat?.x), '--seat-y': tableState.pixels(seat?.y),
      '--drift-x': tableState.pixels(drift?.x), '--drift-y': tableState.pixels(drift?.y),
      '--settle-x': tableState.pixels(settlingFrom?.seat.x), '--settle-y': tableState.pixels(settlingFrom?.seat.y),
      '--settle-drift-x': tableState.pixels(settlingFrom?.drift.x), '--settle-drift-y': tableState.pixels(settlingFrom?.drift.y),
      '--shoved-by': tableState.shoveDistance(shoved)
    }}>
    {children}
  </th>;
};

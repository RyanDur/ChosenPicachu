import {ComponentProps, FC} from 'react';
import {has, maybe} from '@ryandur/sand';
import {classNames} from '@components';
import {useHeaderEvents} from './useHeaderEvents';
import {useTableDispatch} from './useTableDispatch';
import {useTableRead} from './useTableRead';
import {arrows, ColumnDrag, Grab, lifting, looks, Moving, PixelSizes, shares, Survey, survey, tableActions, tableReads, travel} from './model';
import './Header.css';
import './motion.css';

export const DraggableColumn: FC<ComponentProps<'th'> & {column: string}> = ({
  column,
  className,
  children,
  ...th
}) => {
  const dispatch = useTableDispatch();
  const {onColumnMoved} = useHeaderEvents();
  const order = useTableRead(tableReads.order);
  const standing = useTableRead(tableReads.standing);
  const {sorted, data} = useTableRead(tableReads.columnNamed(column))
    .orElse(tableReads.unknownColumn(column));
  const width = useTableRead(tableReads.widthOfColumn(column));
  const {settlingFrom, shoved} = useTableRead(tableReads.columnMarks(column));
  const carried = useTableRead(tableReads.columnHeld(column));
  const drag = useTableRead(tableReads.columnDrag(column));
  const seat = useTableRead(tableReads.seatOfColumn(column));
  const drift = useTableRead(tableReads.driftOfColumn(column));
  const settling = useTableRead(tableReads.settlingOfColumnIn(column, order));
  const count = useTableRead(tableReads.columnCount);
  const travels = useTableRead(tableReads.columnTravels(column));

  const walkedTo = (to: number, widths: PixelSizes): void => {
    dispatch(tableActions.columnWalkedTo(column, to, widths, order));
    onColumnMoved?.({column, to});
  };
  const beside = (neighbor: string, bounds: Survey): void => {
    const to = survey.interior(order.indexOf(neighbor), count);
    dispatch(tableActions.columnMovedBeside(column, neighbor, bounds.columnWidths, order));
    onColumnMoved?.({column, to});
  };

  const lift = (grab: Grab): void => dispatch(tableActions.lifted({axis: 'column', held: column}, grab));
  const moved = (held: ColumnDrag) => (moving: Moving): void => {
    dispatch(tableActions.drifted(moving));
    travel.eager(survey.columnUnder(order, held.survey), column, neighbor => beside(neighbor, held.survey))(moving);
  };
  const release = (): void => {
    if (has(drag) && has(settling)) {
      dispatch(tableActions.dropped({axis: 'column', held: column}, settling, {name: column, order}));
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
    {...travel.whileHeld(maybe(drag), moved, release)}
    onKeyDown={travels ? arrows.column(column, () => order, ({
      to,
      widths
    }) => walkedTo(to, widths)) : undefined}
    onAnimationEnd={() => dispatch(tableActions.settled({axis: 'column', held: column}))}
    style={{
      '--share': shares.width(width),
      ...looks.placement({seat, drift, settlingFrom, shove: shoved})
    }}>
    {children}
  </th>;
};

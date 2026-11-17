import {ComponentProps, FC} from 'react';
import {maybe} from '@ryandur/sand';
import {classNames} from '@components';
import {useHeaderEvents, useTableDispatch, useTableRead} from '@components/DragSortableTable';
import {arrangements, arrows, ColumnDrag, Grab, lifting, looks, Moving, PixelSizes, shares, Survey, survey, tableActions, tableReads, travel} from '@components/DragSortableTable/model';
import {lazyDrop} from './lazyDrop';
import '@components/DragSortableTable/Header.css';
import '@components/DragSortableTable/motion.css';

export const DraggableColumn: FC<ComponentProps<'th'> & {column: string}> = ({column, className, children, ...th}) => {
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
  const view = useTableRead(whole => whole);
  const count = useTableRead(tableReads.columnCount);
  const travels = useTableRead(tableReads.columnTravels(column));

  const walkedTo = (to: number, widths: PixelSizes): void => {
    dispatch(tableActions.columnWalkedTo(column, to, widths, order));
    maybe(onColumnMoved).map(tellMoved => tellMoved({column, to}));
  };
  const beside = (neighbor: string, bounds: Survey): void => {
    const to = survey.interior(order.indexOf(neighbor), count);
    dispatch(tableActions.columnMovedBeside(column, neighbor, bounds.columnWidths, order));
    maybe(onColumnMoved).map(tellMoved => tellMoved({column, to}));
  };

  const lift = (grab: Grab): void => dispatch(tableActions.lifted({axis: 'column', held: column}, grab));
  const moved = (held: ColumnDrag) => (moving: Moving): void => {
    dispatch(tableActions.drifted(moving));
    dispatch(tableActions.columnLandingFound(lazyDrop.column(order, moving)(held)));
  };
  const release = (): void => {
    drag.map(held => {
      const to = held.landing.map(neighbor => survey.interior(order.indexOf(neighbor), count))
        .orElse(order.indexOf(column));
      const settling = tableReads.settlingOfColumnIn(column, arrangements.movedTo(order, column, to))(view);
      lazyDrop.released(held, neighbor => beside(neighbor, held.survey));
      return settling.map(settled => dispatch(tableActions.dropped(
        {axis: 'column', held: column}, settled, {name: column, order: arrangements.movedTo(order, column, to)})));
    });
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
    {...travel.whileHeld(drag, moved, release)}
    onKeyDown={travels ? arrows.column(column, () => order, ({to, widths}) => walkedTo(to, widths)) : undefined}
    onAnimationEnd={() => dispatch(tableActions.settled({axis: 'column', held: column}))}
    style={{
      '--share': width.map(shares.width).orElse(undefined),
      ...looks.placement({seat, drift, settlingFrom, shove: shoved})
    }}>
    {children}
  </th>;
};

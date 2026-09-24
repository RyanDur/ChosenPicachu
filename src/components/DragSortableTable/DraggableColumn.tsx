import {ComponentProps, FC} from 'react';
import {has} from '@ryandur/sand';
import {classNames} from '@components/class-names';
import {shareWidth} from '@components/Table/shares';
import {useHeaderEvents, useTableDispatch, useTableSelector} from './context';
import {columnDrag, columnHeld, columnMarks, columnNamed, unknownColumn, columnTravels, driftOfColumn, seatOfColumn, selectColumnCount, selectOrder, selectStanding, settlingOfColumnIn, widthOfColumn} from './selectors';
import {columnUnder, interior, Survey} from './survey';
import {ColumnDrag, pixels, shoveDistance, shovedClass} from './table-state';
import {lifted, columnMovedBeside, columnWalkedTo, drifted, dropped, settled} from './actions';
import {Moving, eagerTravel, pointerTravel} from './travel';
import {Grab, columnLift} from './lift';
import {columnArrows} from './arrows';
import './Header.css';
import './motion.css';

export const DraggableColumn: FC<ComponentProps<'th'> & {column: string}> = ({column, className, children, ...th}) => {
  const dispatch = useTableDispatch();
  const {onColumnMoved} = useHeaderEvents();
  const order = useTableSelector(selectOrder);
  const standing = useTableSelector(selectStanding);
  const {sorted, data} = useTableSelector(columnNamed(column)).orElse(unknownColumn(column));
  const width = useTableSelector(widthOfColumn(column));
  const {settlingFrom, shoved} = useTableSelector(columnMarks(column));
  const carried = useTableSelector(columnHeld(column));
  const drag = useTableSelector(columnDrag(column));
  const seat = useTableSelector(seatOfColumn(column));
  const drift = useTableSelector(driftOfColumn(column));
  const settling = useTableSelector(settlingOfColumnIn(column, order));
  const count = useTableSelector(selectColumnCount);
  const travels = useTableSelector(columnTravels(column));

  const walkedTo = (to: number, widths: Readonly<Record<string, number>>): void => {
    dispatch(columnWalkedTo(column, to, widths, order));
    onColumnMoved?.({column, to});
  };
  const beside = (neighbour: string, survey: Survey): void => {
    const to = interior(order.indexOf(neighbour), count);
    dispatch(columnMovedBeside(column, neighbour, survey.columnWidths, order));
    onColumnMoved?.({column, to});
  };

  const lift = (grab: Grab): void => dispatch(lifted({axis: 'column', held: column}, grab));
  const moved = (held: ColumnDrag) => (moving: Moving): void => {
    dispatch(drifted(moving));
    eagerTravel(columnUnder(order, held.survey), column, neighbour => beside(neighbour, held.survey))(moving);
  };
  const release = (): void => {
    if (has(drag) && has(settling)) {
      dispatch(dropped({axis: 'column', held: column}, settling));
    }
  };

  return <th {...th}
    className={classNames(className, travels && 'grabbable', carried && 'carried', has(settlingFrom) && 'settling', shovedClass(shoved), has(width) && 'shared')}
    scope="col"
    aria-label={data.label}
    aria-sort={sorted}
    tabIndex={travels ? 0 : undefined}
    onPointerDown={travels ? columnLift(column, () => order, () => standing, lift) : undefined}
    onPointerMove={has(drag) ? pointerTravel(moved(drag), release) : undefined}
    onPointerUp={has(drag) ? release : undefined}
    onPointerCancel={has(drag) ? release : undefined}
    onLostPointerCapture={has(drag) ? pointerTravel(moved(drag), release) : undefined}
    onKeyDown={travels ? columnArrows(column, () => order, ({to, widths}) => walkedTo(to, widths)) : undefined}
    onAnimationEnd={() => dispatch(settled({axis: 'column', held: column}))}
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

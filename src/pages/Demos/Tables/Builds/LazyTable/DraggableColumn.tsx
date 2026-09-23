import {ComponentProps, FC, useState} from 'react';
import {has} from '@ryandur/sand';
import {classNames} from '@components/class-names';
import {shareWidth} from '@components/Table/shares';
import {Landed} from '@components/DragSortableTable/report';
import {MoveReport} from '@components/DragSortableTable/MoveReport';
import {useHeaderEvents, useTableDispatch, useTableSelector} from '@components/DragSortableTable/context';
import {columnDrag, columnHeld, columnMarks, columnNamed, unknownColumn, columnTravels, driftOfColumn, seatOfColumn, selectColumnCount, selectOrder, selectStanding, settlingOfColumnIn, widthOfColumn} from '@components/DragSortableTable/selectors';
import {interior, Survey} from '@components/DragSortableTable/survey';
import {ColumnDrag, pixels, shoveDistance, shovedClass} from '@components/DragSortableTable/table-state';
import {lifted, columnLandingFound, columnMovedBeside, columnWalkedTo, drifted, dropped, settled} from '@components/DragSortableTable/actions';
import {Moving, pointerTravel} from '@components/DragSortableTable/travel';
import {movedTo} from '@components/DragSortableTable/arrangement';
import {releasedColumn, travelledColumn} from './travel';
import {Grab, columnLift} from '@components/DragSortableTable/lift';
import {columnArrows} from '@components/DragSortableTable/arrows';
import '@components/DragSortableTable/Header.css';
import '@components/DragSortableTable/motion.css';

export const DraggableColumn: FC<ComponentProps<'th'> & {column: string}> = ({column, className, children, ...th}) => {
  const dispatch = useTableDispatch();
  const {onColumnMoved} = useHeaderEvents();
  const [landed, setLanded] = useState<Landed>();
  const order = useTableSelector(selectOrder);
  const standing = useTableSelector(selectStanding);
  const {sorted, data} = useTableSelector(columnNamed(column)).orElse(unknownColumn(column));
  const width = useTableSelector(widthOfColumn(column));
  const {settlingFrom, shoved} = useTableSelector(columnMarks(column));
  const carried = useTableSelector(columnHeld(column));
  const drag = useTableSelector(columnDrag(column));
  const seat = useTableSelector(seatOfColumn(column));
  const drift = useTableSelector(driftOfColumn(column));
  const view = useTableSelector(whole => whole);
  const count = useTableSelector(selectColumnCount);
  const travels = useTableSelector(columnTravels(column));

  const walkedTo = (to: number, widths: Readonly<Record<string, number>>): void => {
    dispatch(columnWalkedTo(column, to, widths, order));
    onColumnMoved?.({column, to});
    setLanded({axis: 'column', name: column, position: to, of: count});
  };
  const beside = (neighbour: string, survey: Survey): void => {
    const to = interior(order.indexOf(neighbour), count);
    dispatch(columnMovedBeside(column, neighbour, survey.columnWidths, order));
    onColumnMoved?.({column, to});
    setLanded({axis: 'column', name: column, position: to, of: count});
  };

  const lift = (grab: Grab): void => dispatch(lifted({axis: 'column', held: column}, grab));
  const moved = (held: ColumnDrag) => (moving: Moving): void => {
    dispatch(drifted(moving));
    dispatch(columnLandingFound(travelledColumn(order, moving)(held)));
  };
  const release = (): void => {
    if (has(drag)) {
      const to = has(drag.landing) ? interior(order.indexOf(drag.landing), count) : order.indexOf(column);
      const settling = settlingOfColumnIn(column, movedTo(order, column, to))(view);
      releasedColumn(drag, neighbour => beside(neighbour, drag.survey));
      if (has(settling)) {
        dispatch(dropped({axis: 'column', held: column}, settling));
      }
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
    <MoveReport landed={landed}/>
  </th>;
};

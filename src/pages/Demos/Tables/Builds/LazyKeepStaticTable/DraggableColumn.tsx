import {ComponentProps, FC, useState} from 'react';
import {has} from '@ryandur/sand';
import {classNames} from '@components/class-names';
import {shareWidth} from '@components/Table';
import {Landed} from '@components/DragSortableTable/report';
import {MoveReport} from '@components/DragSortableTable/MoveReport';
import {useHeaderEvents, useTableDispatch, useTableSelector} from '@components/DragSortableTable/context';
import {columnDrag, columnHeld, columnNamed, columnTravels, selectColumnCount, selectOrder, selectStanding, widthOfColumn} from '@components/DragSortableTable/selectors';
import {interior} from '@components/DragSortableTable/survey';
import {ColumnDrag} from '@components/DragSortableTable/table-state';
import {carrying, columnLandingAt, released} from '@components/DragSortableTable/actions';
import {Moving, pointerTravel} from '@components/DragSortableTable/travel';
import {Grab, columnLift} from '@components/DragSortableTable/lift';
import {columnArrows} from '@components/DragSortableTable/arrows';
import {releasedColumn, travelledColumn} from './travel';
import '@components/DragSortableTable/Header.css';

export const DraggableColumn: FC<ComponentProps<'th'> & {column: string}> = ({column, className, children, ...th}) => {
  const dispatch = useTableDispatch();
  const {onColumnMoved} = useHeaderEvents();
  const [landed, setLanded] = useState<Landed>();
  const order = useTableSelector(selectOrder);
  const standing = useTableSelector(selectStanding);
  const {sorted, data} = useTableSelector(columnNamed(column));
  const width = useTableSelector(widthOfColumn(column));
  const carried = useTableSelector(columnHeld(column));
  const drag = useTableSelector(columnDrag(column));
  const count = useTableSelector(selectColumnCount);
  const travels = useTableSelector(columnTravels(column));

  const walkedTo = (to: number): void => {
    onColumnMoved?.({column, to});
    setLanded({axis: 'column', name: column, position: to, of: count});
  };
  const beside = (neighbour: string): void => walkedTo(interior(order.indexOf(neighbour), count));

  const lift = (grab: Grab): void => dispatch(carrying({axis: 'column', held: column}, grab));
  const moved = (held: ColumnDrag) => (moving: Moving): void => {
    dispatch(columnLandingAt(travelledColumn(order, moving)(held)));
  };
  const release = (): void => {
    if (has(drag)) {
      releasedColumn(drag, beside);
    }
    dispatch(released());
  };

  return <th {...th}
             className={classNames(className, travels && 'grabbable', carried && 'carried', has(width) && 'shared')}
             scope="col"
             aria-label={data.label}
             aria-sort={sorted}
             tabIndex={travels ? 0 : undefined}
             onPointerDown={travels ? columnLift(column, () => order, () => standing, lift) : undefined}
             onPointerMove={has(drag) ? pointerTravel(moved(drag), release) : undefined}
             onPointerUp={has(drag) ? release : undefined}
             onPointerCancel={has(drag) ? release : undefined}
             onLostPointerCapture={has(drag) ? pointerTravel(moved(drag), release) : undefined}
             onKeyDown={travels ? columnArrows(column, () => order, ({to}) => walkedTo(to)) : undefined}
             style={{'--share': shareWidth(width)}}>
    {children}
    <MoveReport landed={landed}/>
  </th>;
};

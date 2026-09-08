import {ComponentProps, FC, useState} from 'react';
import {has} from '@ryandur/sand';
import {classNames} from '@components/class-names';
import {shareWidth} from '@components/Table';
import {Landed} from '@components/DragSortableTable/report';
import {MoveReport} from '@components/DragSortableTable/MoveReport';
import {useTableDispatch, useTableSelector} from '@components/DragSortableTable/context';
import {columnDrag, columnNamed, columnTravels, offsetOfColumn, positionOfColumn, selectColumnCount, selectOrder, selectStanding} from '@components/DragSortableTable/selectors';
import {columnUnder, interior} from '@components/DragSortableTable/survey';
import {ColumnDrag, translation} from '@components/DragSortableTable/table-state';
import {carrying, drifted, orderedTo, released} from '@components/DragSortableTable/actions';
import {Moving, eagerTravel, pointerTravel} from '@components/DragSortableTable/travel';
import {Grab, columnLift} from '@components/DragSortableTable/lift';
import {columnArrows} from '@components/DragSortableTable/arrows';
import '@components/DragSortableTable/Header.css';
import './EagerHideStaticTable.css';

export const DraggableColumn: FC<ComponentProps<'th'> & {column: string}> = ({column, className, children, ...th}) => {
  const dispatch = useTableDispatch();
  const [landed, setLanded] = useState<Landed>();
  const order = useTableSelector(selectOrder);
  const standing = useTableSelector(selectStanding);
  const {width, sorted, carried, data} = useTableSelector(columnNamed(column));
  const drag = useTableSelector(columnDrag(column));
  const offset = useTableSelector(offsetOfColumn(column));
  const position = useTableSelector(positionOfColumn(column));
  const count = useTableSelector(selectColumnCount);
  const travels = useTableSelector(columnTravels(column));

  const movedTo = (to: number): void => {
    dispatch(orderedTo(position, to));
    setLanded({axis: 'column', name: column, position: to, of: count});
  };
  const beside = (neighbour: string): void => movedTo(interior(order.indexOf(neighbour), count));

  const lift = (grab: Grab): void => dispatch(carrying({axis: 'column', held: column}, grab));
  const moved = (held: ColumnDrag) => (moving: Moving): void => {
    dispatch(drifted(moving));
    eagerTravel(columnUnder(order, held.survey), column, beside)(moving);
  };
  const release = (): void => {
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
             onKeyDown={travels ? columnArrows(column, () => order, ({to}) => movedTo(to)) : undefined}
             style={{'--share': shareWidth(width), '--carried-by': translation(offset)}}>
    {children}
    <MoveReport landed={landed}/>
  </th>;
};

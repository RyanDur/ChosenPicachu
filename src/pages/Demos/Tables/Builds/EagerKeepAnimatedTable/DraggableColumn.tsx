import {ComponentProps, FC, useState} from 'react';
import {has} from '@ryandur/sand';
import {classNames} from '@components/class-names';
import {shareWidth} from '@components/Table';
import {Landed} from '@components/DragSortableTable/report';
import {MoveReport} from '@components/DragSortableTable/MoveReport';
import {useTableDispatch, useTableSelector} from '@components/DragSortableTable/context';
import {columnDrag, columnNamed, columnTravels, selectColumnCount, selectOrder, selectStanding} from '@components/DragSortableTable/selectors';
import {columnUnder, interior, Survey} from '@components/DragSortableTable/survey';
import {ColumnDrag, shoveDistance, shovedClass, translation} from '@components/DragSortableTable/table-state';
import {carrying, columnMovedBeside, columnWalkedTo, dropped, settled} from '@components/DragSortableTable/actions';
import {Moving, eagerTravel, pointerTravel} from '@components/DragSortableTable/travel';
import {Grab, columnLift} from '@components/DragSortableTable/lift';
import {columnArrows} from '@components/DragSortableTable/arrows';
import '@components/DragSortableTable/Header.css';
import './EagerKeepAnimatedTable.css';

export const DraggableColumn: FC<ComponentProps<'th'> & {column: string}> = ({column, className, children, ...th}) => {
  const dispatch = useTableDispatch();
  const [landed, setLanded] = useState<Landed>();
  const order = useTableSelector(selectOrder);
  const standing = useTableSelector(selectStanding);
  const {width, sorted, carried, settlingFrom, shoved, data} = useTableSelector(columnNamed(column));
  const drag = useTableSelector(columnDrag(column));
  const count = useTableSelector(selectColumnCount);
  const travels = useTableSelector(columnTravels(column));

  const movedTo = (to: number, widths: Readonly<Record<string, number>>): void => {
    dispatch(columnWalkedTo(column, to, widths));
    setLanded({axis: 'column', name: column, position: to, of: count});
  };
  const beside = (neighbour: string, survey: Survey): void => {
    dispatch(columnMovedBeside(column, neighbour, survey.columnWidths));
    setLanded({axis: 'column', name: column, position: interior(order.indexOf(neighbour), count), of: count});
  };

  const lift = (grab: Grab): void => dispatch(carrying({axis: 'column', held: column}, grab));
  const moved = (held: ColumnDrag) => (moving: Moving): void => {
    eagerTravel(columnUnder(order, held.survey), column, neighbour => beside(neighbour, held.survey))(moving);
  };
  const release = (): void => {
    if (has(drag)) {
      dispatch(dropped({axis: 'column', held: column}));
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
             onKeyDown={travels ? columnArrows(column, () => order, ({to, widths}) => movedTo(to, widths)) : undefined}
             onAnimationEnd={() => dispatch(settled({axis: 'column', held: column}))}
             style={{'--share': shareWidth(width), '--settling-from': translation(settlingFrom), '--shoved-by': shoveDistance(shoved)}}>
    {children}
    <MoveReport landed={landed}/>
  </th>;
};

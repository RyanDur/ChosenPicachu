import {ComponentProps, FC, useState} from 'react';
import {has} from '@ryandur/sand';
import {classNames} from '@components/class-names';
import {shareWidth} from '@components/Table';
import {Landed} from '@components/DragSortableTable/report';
import {MoveReport} from '@components/DragSortableTable/MoveReport';
import {useHeaderEvents, useTableDispatch, useTableSelector} from '@components/DragSortableTable/context';
import {columnDrag, columnHeld, columnMarks, columnNamed, columnTravels, offsetOfColumnIn, selectColumnCount, selectOrder, selectStanding, widthOfColumn} from '@components/DragSortableTable/selectors';
import {interior, Survey} from '@components/DragSortableTable/survey';
import {ColumnDrag, shoveDistance, shovedClass, translation} from '@components/DragSortableTable/table-state';
import {carrying, columnLandingAt, columnMovedBeside, columnWalkedTo, dropped, settled} from '@components/DragSortableTable/actions';
import {Moving, pointerTravel, still} from '@components/DragSortableTable/travel';
import {Grab, columnLift} from '@components/DragSortableTable/lift';
import {columnArrows} from '@components/DragSortableTable/arrows';
import {releasedColumn, travelledColumn} from './travel';
import {movedTo} from '@components/DragSortableTable/arrangement';
import '@components/DragSortableTable/Header.css';
import './LazyKeepAnimatedTable.css';

export const DraggableColumn: FC<ComponentProps<'th'> & {column: string}> = ({column, className, children, ...th}) => {
  const dispatch = useTableDispatch();
  const {onColumnMoved} = useHeaderEvents();
  const view = useTableSelector(whole => whole);
  const [landed, setLanded] = useState<Landed>();
  const order = useTableSelector(selectOrder);
  const standing = useTableSelector(selectStanding);
  const {sorted, data} = useTableSelector(columnNamed(column));
  const width = useTableSelector(widthOfColumn(column));
  const {settlingFrom, shoved} = useTableSelector(columnMarks(column));
  const carried = useTableSelector(columnHeld(column));
  const drag = useTableSelector(columnDrag(column));
  const offsetIn = (landing: readonly string[]) => offsetOfColumnIn(column, landing)(view);
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

  const lift = (grab: Grab): void => dispatch(carrying({axis: 'column', held: column}, grab));
  const moved = (held: ColumnDrag) => (moving: Moving): void => {
    dispatch(columnLandingAt(travelledColumn(order, moving)(held)));
  };
  const release = (): void => {
    if (has(drag)) {
      const to = has(drag.landing) ? interior(order.indexOf(drag.landing), count) : order.indexOf(column);
      releasedColumn(drag, neighbour => beside(neighbour, drag.survey));
      dispatch(dropped({axis: 'column', held: column}, offsetIn(movedTo(order, column, to)) ?? still));
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
             style={{'--share': shareWidth(width), '--settling-from': translation(settlingFrom), '--shoved-by': shoveDistance(shoved)}}>
    {children}
    <MoveReport landed={landed}/>
  </th>;
};

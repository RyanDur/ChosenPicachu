import {ComponentProps, FC, useState} from 'react';
import {has} from '@ryandur/sand';
import {classNames} from '@components/class-names';
import {shareWidth} from '@components/Table';
import {Landed} from './report';
import {MoveReport} from './MoveReport';
import {useTableDispatch, useTableSelector} from './context';
import {columnDrag, columnNamed, columnTravels, offsetOfColumn, selectColumnCount, selectOrder, selectStanding} from './selectors';
import {columnUnder, interior, Survey} from './survey';
import {ColumnDrag, shoveDistance, shovedClass, translation} from './table-state';
import {carrying, columnMovedBeside, columnWalkedTo, drifted, dropped, settled} from './actions';
import {Moving, eagerTravel, pointerTravel} from './travel';
import {Grab, columnLift} from './lift';
import {columnArrows} from './arrows';
import './Header.css';
import './motion.css';

export const DraggableColumn: FC<ComponentProps<'th'> & {column: string}> = ({column, className, children, ...th}) => {
  const dispatch = useTableDispatch();
  const [landed, setLanded] = useState<Landed>();
  const order = useTableSelector(selectOrder);
  const standing = useTableSelector(selectStanding);
  const {width, sorted, carried, settlingFrom, shoved, data} = useTableSelector(columnNamed(column));
  const drag = useTableSelector(columnDrag(column));
  const offset = useTableSelector(offsetOfColumn(column));
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
    dispatch(drifted(moving));
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
             style={{'--share': shareWidth(width), '--carried-by': translation(offset), '--settling-from': translation(settlingFrom), '--shoved-by': shoveDistance(shoved)}}>
    {children}
    <MoveReport landed={landed}/>
  </th>;
};

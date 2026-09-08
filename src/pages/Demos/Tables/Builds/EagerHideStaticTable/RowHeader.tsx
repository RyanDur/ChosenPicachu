import {ComponentProps, FC, useState} from 'react';
import {has} from '@ryandur/sand';
import {classNames} from '@components/class-names';
import {Landed} from '@components/DragSortableTable/report';
import {MoveReport} from '@components/DragSortableTable/MoveReport';
import {useTableDispatch, useTableSelector} from '@components/DragSortableTable/context';
import {columnNamed, offsetOfColumn, offsetOfRow, positionOfRow, rowDrag, selectOrder, selectRowCount, selectStanding} from '@components/DragSortableTable/selectors';
import {rowUnder} from '@components/DragSortableTable/survey';
import {RowGrip} from '@components/DragSortableTable/RowGrip';
import {RowDrag, translation} from '@components/DragSortableTable/table-state';
import {drifted, released, rowLifted, rowNudgedTo, seatedTo} from '@components/DragSortableTable/actions';
import {Moving, eagerTravel, pointerTravel} from '@components/DragSortableTable/travel';
import {Grab, rowLift} from '@components/DragSortableTable/lift';
import {rowArrows} from '@components/DragSortableTable/arrows';
import './EagerHideStaticTable.css';

export const RowHeader: FC<ComponentProps<'th'> & {column: string; row: string; label: string}> = ({column, row: seat, label, className, ...th}) => {
  const dispatch = useTableDispatch();
  const order = useTableSelector(selectOrder);
  const {carried: columnCarried} = useTableSelector(columnNamed(column));
  const standing = useTableSelector(selectStanding);
  const position = useTableSelector(positionOfRow(seat));
  const count = useTableSelector(selectRowCount);
  const drag = useTableSelector(rowDrag(seat));
  const columnOffset = useTableSelector(offsetOfColumn(column));
  const rowOffset = useTableSelector(offsetOfRow(seat));
  const [landed, setLanded] = useState<Landed>();

  const movedTo = (to: number): void => {
    dispatch(rowNudgedTo(seat, to, standing));
    setLanded({axis: 'row', position: to, of: count});
  };
  const beside = (neighbour: string): void => {
    dispatch(seatedTo(seat, neighbour));
    setLanded({axis: 'row', position: standing.indexOf(neighbour), of: count});
  };

  const lift = (grab: Grab): void => dispatch(rowLifted(seat, grab, standing));
  const moved = (held: RowDrag) => (moving: Moving): void => {
    dispatch(drifted(moving));
    eagerTravel(rowUnder(standing, held.survey), seat, beside)(moving);
  };
  const release = (): void => {
    dispatch(released());
  };

  return <th {...th} scope="row" aria-label={label}
             onPointerMove={has(drag) ? pointerTravel(moved(drag), release) : undefined}
             onPointerUp={has(drag) ? release : undefined}
             onPointerCancel={has(drag) ? release : undefined}
             onLostPointerCapture={has(drag) ? pointerTravel(moved(drag), release) : undefined}
             className={classNames(className, (columnCarried || has(drag)) && 'carried')}
             style={{'--carried-by': translation(columnOffset ?? rowOffset)}}>
    <RowGrip position={position}
             onLift={rowLift(() => order, () => standing, lift)}
             onArrows={rowArrows(seat, () => standing, ({to}) => movedTo(to))}/>
    {label}
    <MoveReport landed={landed}/>
  </th>;
};

import {ComponentProps, FC, useState} from 'react';
import {has} from '@ryandur/sand';
import {Landed} from '@components/DragSortableTable/report';
import {MoveReport} from '@components/DragSortableTable/MoveReport';
import {useBodyEvents, useTableDispatch, useTableSelector} from '@components/DragSortableTable/context';
import {positionOfRow, rowDrag, selectOrder, selectRowCount, selectStanding} from '@components/DragSortableTable/selectors';
import {rowUnder} from '@components/DragSortableTable/survey';
import {RowGrip} from '@components/DragSortableTable/RowGrip';
import {RowDrag} from '@components/DragSortableTable/table-state';
import {carrying, released} from '@components/DragSortableTable/actions';
import {Moving, eagerTravel, pointerTravel} from '@components/DragSortableTable/travel';
import {Grab, rowLift} from '@components/DragSortableTable/lift';
import {rowArrows} from '@components/DragSortableTable/arrows';

export const RowHeader: FC<ComponentProps<'th'> & {column: string; row: string; label: string}> = ({column: _column, row, label, className, ...th}) => {
  const dispatch = useTableDispatch();
  const {onRowMoved} = useBodyEvents();
  const order = useTableSelector(selectOrder);
  const standing = useTableSelector(selectStanding);
  const position = useTableSelector(positionOfRow(row));
  const count = useTableSelector(selectRowCount);
  const drag = useTableSelector(rowDrag(row));
  const [landed, setLanded] = useState<Landed>();

  const walkedTo = (to: number): void => {
    onRowMoved?.({row, to, standing});
    setLanded({axis: 'row', position: to, of: count});
  };
  const beside = (neighbour: string): void => walkedTo(standing.indexOf(neighbour));

  const lift = (grab: Grab): void => dispatch(carrying({axis: 'row', held: row}, grab));
  const moved = (held: RowDrag) => (moving: Moving): void => {
    eagerTravel(rowUnder(standing, held.survey), row, beside)(moving);
  };
  const release = (): void => {
    dispatch(released());
  };

  return <th {...th} scope="row" aria-label={label}
             className={className}>
    <RowGrip position={position}
             onPointerDown={rowLift(() => order, () => standing, lift)}
             onPointerMove={has(drag) ? pointerTravel(moved(drag), release) : undefined}
             onPointerUp={has(drag) ? release : undefined}
             onPointerCancel={has(drag) ? release : undefined}
             onLostPointerCapture={has(drag) ? pointerTravel(moved(drag), release) : undefined}
             onKeyDown={rowArrows(row, () => standing, ({to}) => walkedTo(to))}/>
    {label}
    <MoveReport landed={landed}/>
  </th>;
};

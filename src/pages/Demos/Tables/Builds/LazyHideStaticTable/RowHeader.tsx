import {ComponentProps, FC, useState} from 'react';
import {has} from '@ryandur/sand';
import {classNames} from '@components/class-names';
import {Landed} from '@components/DragSortableTable/report';
import {MoveReport} from '@components/DragSortableTable/MoveReport';
import {useBodyEvents, useTableDispatch, useTableSelector} from '@components/DragSortableTable/context';
import {columnHeld, offsetOfColumn, offsetOfRow, positionOfRow, rowDrag, rowHeld, selectOrder, selectRowCount, selectStanding} from '@components/DragSortableTable/selectors';
import {RowGrip} from '@components/DragSortableTable/RowGrip';
import {RowDrag, translation} from '@components/DragSortableTable/table-state';
import {carrying, drifted, released, rowLandingAt} from '@components/DragSortableTable/actions';
import {Moving, pointerTravel} from '@components/DragSortableTable/travel';
import {Grab, rowLift} from '@components/DragSortableTable/lift';
import {rowArrows} from '@components/DragSortableTable/arrows';
import {releasedRow, travelledRow} from './travel';
import './LazyHideStaticTable.css';

export const RowHeader: FC<ComponentProps<'th'> & {column: string; row: string; label: string}> = ({column, row, label, className, ...th}) => {
  const dispatch = useTableDispatch();
  const {onRowMoved} = useBodyEvents();
  const order = useTableSelector(selectOrder);
  const columnCarried = useTableSelector(columnHeld(column));
  const carried = useTableSelector(rowHeld(row));
  const standing = useTableSelector(selectStanding);
  const position = useTableSelector(positionOfRow(row));
  const count = useTableSelector(selectRowCount);
  const drag = useTableSelector(rowDrag(row));
  const columnOffset = useTableSelector(offsetOfColumn(column));
  const rowOffset = useTableSelector(offsetOfRow(row));
  const [landed, setLanded] = useState<Landed>();

  const walkedTo = (to: number): void => {
    onRowMoved?.({row, to, standing});
    setLanded({axis: 'row', position: to, of: count});
  };
  const beside = (neighbour: string): void => walkedTo(standing.indexOf(neighbour));

  const lift = (grab: Grab): void => dispatch(carrying({axis: 'row', held: row}, grab));
  const moved = (held: RowDrag) => (moving: Moving): void => {
    dispatch(drifted(moving));
    dispatch(rowLandingAt(travelledRow(standing, moving)(held)));
  };
  const release = (): void => {
    if (has(drag)) {
      releasedRow(drag, beside);
    }
    dispatch(released());
  };

  return <th {...th} scope="row" aria-label={label}
             className={classNames(className, (columnCarried || carried) && 'carried')}
             style={{'--carried-by': translation(columnOffset ?? rowOffset)}}>
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

import {ComponentProps, FC, useState} from 'react';
import {has} from '@ryandur/sand';
import {classNames} from '@components/class-names';
import {Landed} from '@components/DragSortableTable/report';
import {MoveReport} from '@components/DragSortableTable/MoveReport';
import {useBodyEvents, useTableDispatch, useTableSelector} from '@components/DragSortableTable/context';
import {columnHeld, offsetOfColumn, offsetOfRow, offsetOfRowIn, positionOfRow, rowDrag, rowHeld, rowMarks, selectOrder, selectRowCount, selectStanding} from '@components/DragSortableTable/selectors';
import {Survey} from '@components/DragSortableTable/survey';
import {RowGrip} from '@components/DragSortableTable/RowGrip';
import {RowDrag, shoveDistance, shovedClass, translation} from '@components/DragSortableTable/table-state';
import {carrying, drifted, dropped, rowLandingAt, rowMovedBeside, rowWalkedTo, settled} from '@components/DragSortableTable/actions';
import {Moving, pointerTravel, still} from '@components/DragSortableTable/travel';
import {Grab, rowLift} from '@components/DragSortableTable/lift';
import {rowArrows} from '@components/DragSortableTable/arrows';
import {releasedRow, travelledRow} from './travel';
import {movedTo} from '@components/DragSortableTable/arrangement';
import './LazyHideAnimatedTable.css';

export const RowHeader: FC<ComponentProps<'th'> & {column: string; row: string; label: string}> = ({column, row, label, className, ...th}) => {
  const dispatch = useTableDispatch();
  const {onRowMoved} = useBodyEvents();
  const view = useTableSelector(whole => whole);
  const order = useTableSelector(selectOrder);
  const columnCarried = useTableSelector(columnHeld(column));
  const carried = useTableSelector(rowHeld(row));
  const {settlingFrom, shoved} = useTableSelector(rowMarks(row));
  const standing = useTableSelector(selectStanding);
  const position = useTableSelector(positionOfRow(row));
  const count = useTableSelector(selectRowCount);
  const drag = useTableSelector(rowDrag(row));
  const columnOffset = useTableSelector(offsetOfColumn(column));
  const rowOffset = useTableSelector(offsetOfRow(row));
  const offsetIn = (landing: readonly string[]) => offsetOfRowIn(row, landing)(view);
  const [landed, setLanded] = useState<Landed>();

  const walkedTo = (to: number, heights: Readonly<Record<string, number>>): void => {
    dispatch(rowWalkedTo(row, to, heights, standing));
    onRowMoved?.({row, to, standing});
    setLanded({axis: 'row', position: to, of: count});
  };
  const beside = (neighbour: string, survey: Survey): void => {
    const to = standing.indexOf(neighbour);
    dispatch(rowMovedBeside(row, neighbour, survey.rowHeights, standing));
    onRowMoved?.({row, to, standing});
    setLanded({axis: 'row', position: to, of: count});
  };

  const lift = (grab: Grab): void => dispatch(carrying({axis: 'row', held: row}, grab));
  const moved = (held: RowDrag) => (moving: Moving): void => {
    dispatch(drifted(moving));
    dispatch(rowLandingAt(travelledRow(standing, moving)(held)));
  };
  const release = (): void => {
    if (has(drag)) {
      const to = has(drag.landing) ? standing.indexOf(drag.landing) : standing.indexOf(row);
      releasedRow(drag, neighbour => beside(neighbour, drag.survey));
      dispatch(dropped({axis: 'row', held: row}, offsetIn(movedTo(standing, row, to)) ?? still));
    }
  };

  return <th {...th} scope="row" aria-label={label}
             onAnimationEnd={() => dispatch(settled({axis: 'row', held: row}))}
             className={classNames(className, (columnCarried || carried) && 'carried', has(settlingFrom) && 'settling', shovedClass(shoved))}
             style={{'--carried-by': translation(columnOffset ?? rowOffset), '--settling-from': translation(settlingFrom), '--shoved-by': shoveDistance(shoved)}}>
    <RowGrip position={position}
             onPointerDown={rowLift(() => order, () => standing, lift)}
             onPointerMove={has(drag) ? pointerTravel(moved(drag), release) : undefined}
             onPointerUp={has(drag) ? release : undefined}
             onPointerCancel={has(drag) ? release : undefined}
             onLostPointerCapture={has(drag) ? pointerTravel(moved(drag), release) : undefined}
             onKeyDown={rowArrows(row, () => standing, ({to, heights}) => walkedTo(to, heights))}/>
    {label}
    <MoveReport landed={landed}/>
  </th>;
};

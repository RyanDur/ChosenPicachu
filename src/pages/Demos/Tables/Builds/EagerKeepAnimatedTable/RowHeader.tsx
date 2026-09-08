import {ComponentProps, FC, useState} from 'react';
import {has} from '@ryandur/sand';
import {classNames} from '@components/class-names';
import {Landed} from '@components/DragSortableTable/report';
import {MoveReport} from '@components/DragSortableTable/MoveReport';
import {useTableDispatch, useTableSelector} from '@components/DragSortableTable/context';
import {columnNamed, positionOfRow, rowAt, rowDrag, selectOrder, selectRowCount, selectStanding} from '@components/DragSortableTable/selectors';
import {rowUnder, Survey} from '@components/DragSortableTable/survey';
import {RowGrip} from '@components/DragSortableTable/RowGrip';
import {RowDrag, shoveDistance, shovedClass, translation} from '@components/DragSortableTable/table-state';
import {dropped, rowLifted, rowMovedBeside, rowWalkedTo, settled} from '@components/DragSortableTable/actions';
import {Moving, eagerTravel, pointerTravel} from '@components/DragSortableTable/travel';
import {Grab, rowLift} from '@components/DragSortableTable/lift';
import {rowArrows} from '@components/DragSortableTable/arrows';
import './EagerKeepAnimatedTable.css';

export const RowHeader: FC<ComponentProps<'th'> & {column: string; row: string; label: string}> = ({column, row: seat, label, className, ...th}) => {
  const dispatch = useTableDispatch();
  const order = useTableSelector(selectOrder);
  const {carried: columnCarried} = useTableSelector(columnNamed(column));
  const {carried, settlingFrom, shoved} = useTableSelector(rowAt(seat));
  const standing = useTableSelector(selectStanding);
  const position = useTableSelector(positionOfRow(seat));
  const count = useTableSelector(selectRowCount);
  const drag = useTableSelector(rowDrag(seat));
  const [landed, setLanded] = useState<Landed>();

  const movedTo = (to: number, heights: Readonly<Record<string, number>>): void => {
    dispatch(rowWalkedTo(seat, to, heights, standing));
    setLanded({axis: 'row', position: to, of: count});
  };
  const beside = (neighbour: string, survey: Survey): void => {
    dispatch(rowMovedBeside(seat, neighbour, survey.rowHeights));
    setLanded({axis: 'row', position: standing.indexOf(neighbour), of: count});
  };

  const lift = (grab: Grab): void => dispatch(rowLifted(seat, grab, standing));
  const moved = (held: RowDrag) => (moving: Moving): void => {
    eagerTravel(rowUnder(standing, held.survey), seat, neighbour => beside(neighbour, held.survey))(moving);
  };
  const release = (): void => {
    if (has(drag)) {
      dispatch(dropped({axis: 'row', held: seat}));
    }
  };

  return <th {...th} scope="row" aria-label={label}
             onPointerMove={has(drag) ? pointerTravel(moved(drag), release) : undefined}
             onPointerUp={has(drag) ? release : undefined}
             onPointerCancel={has(drag) ? release : undefined}
             onLostPointerCapture={has(drag) ? pointerTravel(moved(drag), release) : undefined}
             onAnimationEnd={() => dispatch(settled({axis: 'row', held: seat}))}
             className={classNames(className, (columnCarried || carried) && 'carried', has(settlingFrom) && 'settling', shovedClass(shoved))}
             style={{'--settling-from': translation(settlingFrom), '--shoved-by': shoveDistance(shoved)}}>
    <RowGrip position={position}
             onLift={rowLift(() => order, () => standing, lift)}
             onArrows={rowArrows(seat, () => standing, ({to, heights}) => movedTo(to, heights))}/>
    {label}
    <MoveReport landed={landed}/>
  </th>;
};

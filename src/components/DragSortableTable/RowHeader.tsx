import {ComponentProps, FC, useState} from 'react';
import {has} from '@ryandur/sand';
import {classNames} from '@components/class-names';
import {Landed} from './report';
import {MoveReport} from './MoveReport';
import {useTableDispatch, useTableSelector} from './context';
import {columnNamed, offsetOfColumn, offsetOfRow, positionOfRow, rowAt, rowDrag, selectOrder, selectRowCount, selectStanding} from './selectors';
import {rowUnder, Survey} from './survey';
import {RowGrip} from './RowGrip';
import {RowDrag, shoveDistance, shovedClass, translation} from './table-state';
import {drifted, dropped, rowLifted, rowMovedBeside, rowWalkedTo, settled} from './actions';
import {Moving, eagerTravel, pointerTravel} from './travel';
import {Grab, rowLift} from './lift';
import {rowArrows} from './arrows';
import './motion.css';

export const RowHeader: FC<ComponentProps<'th'> & {column: string; row: string; label: string}> = ({column, row: seat, label, className, ...th}) => {
  const dispatch = useTableDispatch();
  const order = useTableSelector(selectOrder);
  const {carried: columnCarried} = useTableSelector(columnNamed(column));
  const {carried, settlingFrom, shoved} = useTableSelector(rowAt(seat));
  const standing = useTableSelector(selectStanding);
  const position = useTableSelector(positionOfRow(seat));
  const count = useTableSelector(selectRowCount);
  const drag = useTableSelector(rowDrag(seat));
  const columnOffset = useTableSelector(offsetOfColumn(column));
  const rowOffset = useTableSelector(offsetOfRow(seat));
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
    dispatch(drifted(moving));
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
             style={{'--carried-by': translation(columnOffset ?? rowOffset), '--settling-from': translation(settlingFrom), '--shoved-by': shoveDistance(shoved)}}>
    <RowGrip position={position}
             onLift={rowLift(() => order, () => standing, lift)}
             onArrows={rowArrows(seat, () => standing, ({to, heights}) => movedTo(to, heights))}/>
    {label}
    <MoveReport landed={landed}/>
  </th>;
};

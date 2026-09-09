import {ComponentProps, FC, useState} from 'react';
import {has} from '@ryandur/sand';
import {classNames} from '@components/class-names';
import {Landed} from './report';
import {MoveReport} from './MoveReport';
import {useBodyEvents, useTableDispatch, useTableSelector} from './context';
import {columnHeld, offsetOfColumn, offsetOfRow, positionOfRow, rowDrag, rowHeld, rowMarks, selectOrder, selectRowCount, selectStanding} from './selectors';
import {rowUnder, Survey} from './survey';
import {RowGrip} from './RowGrip';
import {RowDrag, shoveDistance, shovedClass, translation} from './table-state';
import {carrying, drifted, dropped, rowMovedBeside, rowWalkedTo, settled} from './actions';
import {Moving, eagerTravel, pointerTravel, still} from './travel';
import {Grab, rowLift} from './lift';
import {rowArrows} from './arrows';
import './motion.css';

export const RowHeader: FC<ComponentProps<'th'> & {column: string; row: string; label: string}> = ({column, row, label, className, ...th}) => {
  const dispatch = useTableDispatch();
  const {onRowMoved} = useBodyEvents();
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
    eagerTravel(rowUnder(standing, held.survey), row, neighbour => beside(neighbour, held.survey))(moving);
  };
  const release = (): void => {
    if (has(drag)) {
      dispatch(dropped({axis: 'row', held: row}, rowOffset ?? still));
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

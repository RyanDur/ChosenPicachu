import {FC, PointerEvent} from 'react';
import {has, notEmpty} from '@ryandur/sand';
import {classNames} from '@components/class-names';
import {array} from '@components/arrays';
import {Column, Row, TableProps} from '@components/Table';
import {RowGrip} from './RowGrip';

type Table = {
  rows: TableProps['rows'];
  ordered: readonly Column[];
  standing: readonly number[];
  gripped: boolean;
  aloft?: number;
  aloftColumn?: string;
  className: string;
  cellClassName: string;
  onLift: (seat: number) => (event: PointerEvent<HTMLElement>) => void;
  onArranged: (after: number[]) => void;
};

type Props = {
  seat: number;
  table: Table;
};

export const DraggableRow: FC<Props> = ({seat, table}) => {
  const {rows, ordered, standing, gripped, aloft, aloftColumn, className, cellClassName, onLift, onArranged} = table;
  const row: Row = rows[seat];
  const position = standing.indexOf(seat);
  const clipped = notEmpty(ordered.filter(({width}) => has(width)));
  const hidden = aloft === seat;

  return <tr className={className}>
    {ordered.map(({column}, columnNumber) => {
      const cell = row[column];
      const key = column;
      return <td className={classNames(
        cellClassName, cell.className,
        clipped && 'ellipsis',
        aloftColumn === key && 'hide',
        hidden && 'hide-across'
      )}
                 key={key}>
        {columnNumber === 0 && gripped &&
            <RowGrip row={position + 1} onLift={onLift(seat)}
                     onNudge={toward => {
                       const to = Math.min(Math.max(position + toward, 0), standing.length - 1);
                       onArranged(array.moveToIndex(to, seat, standing));
                     }}/>}
        {cell.display}
      </td>;
    })}
  </tr>;
};

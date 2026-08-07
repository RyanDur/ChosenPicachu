import {FC, PointerEvent} from 'react';
import {classNames} from '@components/class-names';
import {array} from '@components/arrays';
import {Row as RowData} from '@components/Table';
import {RowGrip} from '../RowGrip';

type Props = {
  card: number;
  row: RowData;
  columns: readonly string[];
  clipped: boolean;
  standing: readonly number[];
  gripped: boolean;
  aloft?: number;
  aloftColumn?: string;
  className: string;
  cellClassName: string;
  onLift: (card: number) => (event: PointerEvent<HTMLElement>) => void;
  onArranged: (after: number[]) => void;
};

export const Row: FC<Props> = (
  {card, row, columns, clipped, standing, gripped, aloft, aloftColumn, className, cellClassName, onLift, onArranged}
) => {
  const position = standing.indexOf(card);
  const hidden = aloft === card;

  return <tr className={className}>
    {columns.map((column, columnNumber) => {
      const cell = row[column];
      return <td className={classNames(
        cellClassName, cell.className,
        clipped && 'ellipsis',
        aloftColumn === column && 'hide',
        hidden && 'hide-across'
      )}
                 key={column}>
        {columnNumber === 0 && gripped &&
            <RowGrip row={position + 1} onLift={onLift(card)}
                     onNudge={toward => {
                       const to = Math.min(Math.max(position + toward, 0), standing.length - 1);
                       onArranged(array.moveToIndex(to, card, standing));
                     }}/>}
        {cell.display}
      </td>;
    })}
  </tr>;
};

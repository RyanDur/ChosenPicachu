import {FC, PointerEvent} from 'react';
import {has, notEmpty} from '@ryandur/sand';
import {classNames} from '@components/class-names';
import {array} from '@components/arrays';
import {Column, Row, TableProps} from '@components/Table';
import {Shifted, Slid, charted, shifts} from './chart';
import {RowGrip} from './RowGrip';
import './displaced.css';
import './AnimatedDraggableRow.css';

type Table = {
  rows: TableProps['rows'];
  ordered: readonly Column[];
  standing: readonly number[];
  gripped: boolean;
  aloft?: number;
  aloftColumn?: string;
  slid?: Slid;
  shifted?: Shifted;
  className: string;
  cellClassName: string;
  onLift: (card: number) => (event: PointerEvent<HTMLElement>) => void;
  onArranged: (after: number[], drops: Shifted) => void;
};

type Props = {
  card: number;
  table: Table;
};

export const AnimatedDraggableRow: FC<Props> = ({card, table}) => {
  const {rows, ordered, standing, gripped, aloft, aloftColumn, slid, shifted, className, cellClassName, onLift, onArranged} = table;
  const row: Row = rows[card];
  const position = standing.indexOf(card);
  const clipped = notEmpty(ordered.filter(({width}) => has(width)));
  const hidden = aloft === card;
  const drop = shifted?.[card];

  return <tr className={classNames(className, has(drop) && 'shifted')}
             style={has(drop) ? {'--drop': `${drop}px`} : undefined}>
    {ordered.map(({column}, columnNumber) => {
      const cell = row[column];
      const displaced = slid?.[column];
      return <td className={classNames(
        cellClassName, cell.className,
        clipped && 'ellipsis',
        aloftColumn === column && 'hide',
        hidden && 'hide-across',
        has(displaced) && 'displaced'
      )}
                 key={column}
                 style={has(displaced)
                   ? {'--carried': `${displaced.by}`, '--toward': displaced.toward === 'left' ? '1' : '-1'}
                   : undefined}>
        {columnNumber === 0 && gripped &&
            <RowGrip row={position + 1} onLift={onLift(card)}
                     onNudge={(toward, event) => {
                       const lane = event.currentTarget.closest('tr');
                       if (has(lane) && (lane.getAnimations?.().length ?? 0) > 0) {
                         return;
                       }
                       const to = Math.min(Math.max(position + toward, 0), standing.length - 1);
                       const after = array.moveToIndex(to, card, standing);
                       const table = event.currentTarget.closest('table');
                       onArranged(after, has(table)
                         ? shifts(charted(table, standing).rowHeights, standing, after)
                         : {});
                     }}/>}
        {cell.display}
      </td>;
    })}
  </tr>;
};

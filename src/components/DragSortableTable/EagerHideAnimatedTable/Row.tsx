import {FC, PointerEvent} from 'react';
import {Maybe, has, maybe, nothing} from '@ryandur/sand';
import {classNames} from '@components/class-names';
import {Row as RowData} from '@components/Table';
import {Shifted, Slid, rowNudge, surveyed} from '../survey';
import {RowGrip} from '../RowGrip';

type Props = {
  row: number;
  cells: RowData;
  columns: readonly string[];
  clipped: boolean;
  standing: readonly number[];
  gripped: boolean;
  aloft?: Maybe<number>;
  aloftColumn?: Maybe<string>;
  slid?: Slid;
  shifted?: Shifted;
  className: string;
  cellClassName: string;
  onLift: (row: number) => (event: PointerEvent<HTMLElement>) => void;
  onArranged: (after: number[], drops: Shifted) => void;
};

export const Row: FC<Props> = (
  {
    row,
    cells,
    columns,
    clipped,
    standing,
    gripped,
    aloft = nothing(),
    aloftColumn = nothing(),
    slid,
    shifted,
    className,
    cellClassName,
    onLift,
    onArranged
  }
) => {
  const position = standing.indexOf(row);
  const hidden = aloft.map(held => held === row).orElse(false);
  const drop = shifted?.[row];

  return <tr className={classNames(className, has(drop) && 'shifted')}
             style={has(drop) ? {'--drop': `${drop}px`} : undefined}>
    {columns.map((column, columnNumber) => {
      const cell = cells[column];
      const displaced = slid?.[column];
      const rowHeader = columnNumber === 0 && gripped;
      const dress = classNames(
        cellClassName, cell.className,
        rowHeader && 'row-header',
        clipped && 'ellipsis',
        aloftColumn.map(held => held === column).orElse(false) && 'hide',
        hidden && 'hide-across',
        has(displaced) && 'displaced'
      );
      const theater = has(displaced)
        ? {'--carried': `${displaced.by}px`, '--toward': displaced.toward === 'left' ? '1' : '-1'}
        : undefined;
      return rowHeader
        ? <th scope="row" className={dress} key={column} style={theater}>
          <div className="row-header-content">
            <RowGrip position={position} onLift={onLift(row)}
                     onNudge={(toward, event) => {
                       const sliding = maybe(event.currentTarget.closest('tr'))
                         .map(lane => lane.getAnimations().length > 0)
                         .orElse(false);
                       if (sliding) {
                         return;
                       }
                       maybe(event.currentTarget.closest('table')).map(table => {
                         const nudge = rowNudge(standing, surveyed(table, columns, standing).rowHeights)(row, toward);
                         onArranged(nudge.after, nudge.drops);
                       });
                     }}/>
            {cell.display}
          </div>
        </th>
        : <td className={dress} key={column} style={theater}>{cell.display}</td>;
    })}
  </tr>;
};

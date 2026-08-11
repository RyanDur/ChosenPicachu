import {FC, PointerEvent} from 'react';
import {has} from '@ryandur/sand';
import {classNames} from '@components/class-names';
import {array} from '@components/arrays';
import {Row as RowData} from '@components/Table';
import {Shifted, Slid, surveyed, shifts} from '../survey';
import {RowGrip} from '../RowGrip';

type Props = {
  row: number;
  cells: RowData;
  columns: readonly string[];
  clipped: boolean;
  standing: readonly number[];
  gripped: boolean;
  aloft?: number;
  aloftColumn?: string;
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
    aloft,
    aloftColumn,
    slid,
    shifted,
    className,
    cellClassName,
    onLift,
    onArranged
  }
) => {
  const position = standing.indexOf(row);
  const hidden = aloft === row;
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
        aloftColumn === column && 'hide',
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
                       const lane = event.currentTarget.closest('tr');
                       if (has(lane) && lane.getAnimations().length > 0) {
                         return;
                       }
                       const to = Math.min(Math.max(position + toward, 0), standing.length - 1);
                       const after = array.moveToIndex(to, row, standing);
                       const table = event.currentTarget.closest('table');
                       onArranged(after, has(table)
                         ? shifts(surveyed(table, columns, standing).rowHeights, standing, after)
                         : {});
                     }}/>
            {cell.display}
          </div>
        </th>
        : <td className={dress} key={column} style={theater}>{cell.display}</td>;
    })}
  </tr>;
};

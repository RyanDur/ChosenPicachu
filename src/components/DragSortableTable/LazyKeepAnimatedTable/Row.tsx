import {FC, PointerEvent} from 'react';
import {Maybe, has, nothing} from '@ryandur/sand';
import {animatedRowArrows} from '../travel';
import {classNames} from '@components/class-names';
import {RowData} from '@components/Table';
import {RowNudge, Shifted, Slid} from '../survey';
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
  onLift: (row: number) => (event: PointerEvent<HTMLElement>) => void;
  onArranged: (to: number, drops: Shifted) => void;
};

export const Row: FC<Props> = (
  {row, cells, columns, clipped, standing, gripped, aloft = nothing(), aloftColumn = nothing(), slid, shifted, onLift, onArranged}
) => {
  const position = standing.indexOf(row);
  const arranged = (nudge: RowNudge): void => onArranged(nudge.to, nudge.drops);
  const hidden = aloft.map(held => held === row).orElse(false);
  const drop = shifted?.[row];

  return <tr className={classNames('row', has(drop) && 'shifted')}
             style={has(drop) ? {'--drop': `${drop}px`} : undefined}>
    {columns.map((column, columnNumber) => {
      const cell = cells[column];
      const displaced = slid?.[column];
      const rowHeader = columnNumber === 0 && gripped;
      const dress = classNames(
        'cell', cell.className,
        rowHeader && 'row-header',
        clipped && 'ellipsis',
        aloftColumn.map(held => held === column).orElse(false) && 'hide',
        hidden && 'hide-across',
        has(displaced) && 'displaced'
      );
      const drawn = has(displaced)
        ? {'--carried': `${displaced.by}px`, '--toward': displaced.toward === 'left' ? '1' : '-1'}
        : undefined;
      return rowHeader
        ? <th scope="row" className={dress} key={column} style={drawn}>
          <div className="row-header-content">
            <RowGrip position={position} onLift={onLift(row)}
                     onArrows={animatedRowArrows(row, () => columns, () => standing, arranged)}/>
            {cell.display}
          </div>
        </th>
        : <td className={dress} key={column} style={drawn}>{cell.display}</td>;
    })}
  </tr>;
};

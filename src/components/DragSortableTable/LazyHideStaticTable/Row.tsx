import {FC, PointerEvent} from 'react';
import {Maybe, nothing} from '@ryandur/sand';
import {staticRowArrows} from '../travel';
import {classNames} from '@components/class-names';
import {Row as RowData} from '@components/Table';
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
  className: string;
  cellClassName: string;
  onLift: (row: number) => (event: PointerEvent<HTMLElement>) => void;
  onArranged: (to: number) => void;
};

export const Row: FC<Props> = (
  {row, cells, columns, clipped, standing, gripped, aloft = nothing(), aloftColumn = nothing(), className, cellClassName, onLift, onArranged}
) => {
  const position = standing.indexOf(row);
  const arranged = ({to}: {to: number; after: number[]}): void => onArranged(to);
  const hidden = aloft.map(held => held === row).orElse(false);

  return <tr className={className}>
    {columns.map((column, columnNumber) => {
      const cell = cells[column];
      const rowHeader = columnNumber === 0 && gripped;
      const dress = classNames(
        cellClassName, cell.className,
        rowHeader && 'row-header',
        clipped && 'ellipsis',
        aloftColumn.map(held => held === column).orElse(false) && 'hide',
        hidden && 'hide-across'
      );
      return rowHeader
        ? <th scope="row" className={dress} key={column}>
          <div className="row-header-content">
            <RowGrip position={position} onLift={onLift(row)}
                     onArrows={staticRowArrows(row, () => standing, arranged)}/>
            {cell.display}
          </div>
        </th>
        : <td className={dress} key={column}>{cell.display}</td>;
    })}
  </tr>;
};

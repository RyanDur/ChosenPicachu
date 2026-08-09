import {FC, PointerEvent} from 'react';
import {classNames} from '@components/class-names';
import {array} from '@components/arrays';
import {Row as RowData} from '@components/Table';
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
  className: string;
  cellClassName: string;
  onLift: (row: number) => (event: PointerEvent<HTMLElement>) => void;
  onArranged: (after: number[]) => void;
};

export const Row: FC<Props> = (
  {row, cells, columns, clipped, standing, gripped, aloft, aloftColumn, className, cellClassName, onLift, onArranged}
) => {
  const position = standing.indexOf(row);
  const hidden = aloft === row;

  return <tr className={className}>
    {columns.map((column, columnNumber) => {
      const cell = cells[column];
      const rowHeader = columnNumber === 0 && gripped;
      const dress = classNames(
        cellClassName, cell.className,
        rowHeader && 'row-header',
        clipped && 'ellipsis',
        aloftColumn === column && 'hide',
        hidden && 'hide-across'
      );
      return rowHeader
        ? <th scope="row" className={dress} key={column}>
          <div className="row-header-content">
            <RowGrip position={position} onLift={onLift(row)}
                     onNudge={toward => {
                       const to = Math.min(Math.max(position + toward, 0), standing.length - 1);
                       onArranged(array.moveToIndex(to, row, standing));
                     }}/>
            {cell.display}
          </div>
        </th>
        : <td className={dress} key={column}>{cell.display}</td>;
    })}
  </tr>;
};

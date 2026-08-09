import {FC, ReactNode, useState} from 'react';
import {has, notEmpty} from '@ryandur/sand';
import {classNames} from '@components/class-names';
import {Shares, measuredShares, neighborOf, traded} from './shares';
import {ResizeHandle} from './ResizeHandle';
import './Table.css';

export type Cell = {
  display: ReactNode;
  className?: string;
  value?: number;
}

export type Row = {
  [column in string | number]: Cell;
};

export type Column = Cell & {
  column: string;
}

export type Dress = {
  tableClassName?: string;
  theadClassName?: string;
  tbodyClassName?: string;
  trClassName?: string;
  thClassName?: string;
  tdClassName?: string;
  headerRowClassName?: string;
  rowClassName?: string;
  cellClassName?: string;
};

export type TableProps = Dress & {
  columns: Column[];
  rows: Row[];
  id?: string;
  resizableColumns?: boolean;
};

export const Table: FC<TableProps> = ({columns, rows, id, resizableColumns, ...dress}) => {
  const [shares, setShares] = useState<Shares>();
  const apportioned = resizableColumns ? columns.map(({column}) => column) : [];
  const clipped = notEmpty(apportioned);
  const awaken = (table: HTMLTableElement): void =>
    setShares(previous => previous ?? measuredShares(apportioned, table));

  return <table id={id} className={classNames(dress.tableClassName, clipped && 'apportioned')}>
    <thead className={dress.theadClassName}>
    <tr className={classNames(dress.trClassName, dress.headerRowClassName)}>
      {columns.map(({display, column, className}) => {
        const share = clipped ? shares?.[column] : undefined;
        return <th key={column}
                   scope="col"
                   className={classNames(dress.thClassName, dress.cellClassName, className, 'header-cell',
                     clipped && 'clipped', has(share) && 'shared')}
                   style={has(share) ? {'--share': `${share}%`} : undefined}>
          <div className="header-cell-content">
            {display}
            {clipped && apportioned.length > 1 &&
              <ResizeHandle column={column}
                            share={share}
                            onAwaken={awaken}
                            onTrade={delta => setShares(previous =>
                              previous && traded(column, neighborOf(apportioned, column), delta)(previous))}/>}
          </div>
        </th>;
      })}
    </tr>
    </thead>
    <tbody className={dress.tbodyClassName}>
      {rows.map((row, rowNumber) =>
        <tr className={classNames(dress.trClassName, dress.rowClassName)} key={rowNumber}>
          {columns.map(({column}, columnNumber) => {
            const cell = row[column];
            return <td key={columnNumber}
                       className={classNames(dress.tdClassName, dress.cellClassName, cell.className,
                         clipped && 'ellipsis')}>
              {cell.display}
            </td>;
          })}
        </tr>)}
    </tbody>
  </table>;
};

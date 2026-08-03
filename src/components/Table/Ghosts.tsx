import {FC, ReactNode, RefObject} from 'react';
import {join} from '@components/class-names';
import {Column, Row} from './types';

type Dress = {
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

type GhostProps = {
    at: {x: number; y: number; width: number};
    ghost: RefObject<HTMLTableElement | null>;
    dress: Dress;
    children: ReactNode;
};

const Ghost: FC<GhostProps> = ({at, ghost, dress, children}) =>
    <table ref={ghost}
           className={join(dress.tableClassName, 'column-ghost')}
           style={{
               position: 'fixed',
               top: at.y,
               left: at.x,
               width: at.width,
               willChange: 'transform',
               background: 'var(--paper)',
               boxShadow: 'var(--lift-box-shadow)',
               pointerEvents: 'none'
           }}>
        {children}
    </table>;

type ColumnGhostProps = {
    at: {x: number; y: number; width: number};
    ghost: RefObject<HTMLTableElement | null>;
    dress: Dress;
    column: Column;
    rows: Row[];
};

export const ColumnGhost: FC<ColumnGhostProps> = ({at, ghost, dress, column, rows}) =>
    <Ghost at={at} ghost={ghost} dress={dress}>
        <thead className={dress.theadClassName}>
        <tr className={join(dress.trClassName, dress.headerRowClassName)}>
            <th className={join(dress.thClassName, dress.cellClassName, column.className, 'clipped')} scope="col">
                {column.display}
            </th>
        </tr>
        </thead>
        <tbody className={dress.tbodyClassName}>{rows.map((row, seat) =>
            <tr className={join(dress.trClassName, dress.rowClassName)} key={seat}>
                <td className={join(dress.tdClassName, dress.cellClassName, row[column.column].className, 'ellipsis')}>
                    {row[column.column].display}
                </td>
            </tr>
        )}</tbody>
    </Ghost>;

type RowGhostProps = {
    at: {x: number; y: number; width: number};
    ghost: RefObject<HTMLTableElement | null>;
    dress: Dress;
    columns: Column[];
    row: Row;
};

export const RowGhost: FC<RowGhostProps> = ({at, ghost, dress, columns, row}) =>
    <Ghost at={at} ghost={ghost} dress={dress}>
        <tbody className={dress.tbodyClassName}>
        <tr className={join(dress.trClassName, dress.rowClassName)}>
            {columns.map(({column}, place) =>
                <td className={join(dress.tdClassName, dress.cellClassName, row[column].className, 'ellipsis')}
                    key={place}>
                    {row[column].display}
                </td>
            )}
        </tr>
        </tbody>
    </Ghost>;

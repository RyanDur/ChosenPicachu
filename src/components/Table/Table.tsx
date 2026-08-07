import {FC, ReactNode, useState} from 'react';
import {has, notEmpty} from '@ryandur/sand';
import {classNames} from '@components/class-names';
import {Shares, neighborOf, seededShares, traded} from './shares';
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
    width?: number;
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
};

export const Table: FC<TableProps> = ({columns, rows, id, ...dress}) => {
    const [shares, setShares] = useState<Shares>(() => seededShares(columns));
    const apportioned = columns.filter(({width}) => has(width)).map(({column}) => column);
    const clipped = notEmpty(apportioned);

    return <table id={id} className={classNames(dress.tableClassName, clipped && 'apportioned')}>
        <thead className={dress.theadClassName}>
        <tr className={classNames(
            dress.trClassName,
            dress.headerRowClassName
        )}>{columns.map(({display, column, className, width}) => {
            const key = column;
            const share = has(width) ? shares[key] : undefined;
            return <th className={classNames(dress.thClassName, dress.cellClassName, className, clipped && 'clipped')}
                       key={key}
                       scope="col"
                       style={has(share) ? {width: `${share}%`} : undefined}>
                {display}
                {has(share) && apportioned.length > 1 &&
                    <ResizeHandle column={key}
                                  share={share}
                                  onTrade={delta => setShares(traded(key, neighborOf(apportioned, key), delta))}/>}
            </th>;
        })}</tr>
        </thead>
        <tbody className={dress.tbodyClassName}>{rows.map((row, rowNumber) =>
            <tr className={classNames(dress.trClassName, dress.rowClassName)} key={rowNumber}>
                {columns.map(({column}, columnNumber) => {
                    const cell = row[column];
                    return <td className={classNames(dress.tdClassName, dress.cellClassName, cell.className,
                                   clipped && 'ellipsis')}
                               key={columnNumber}>{cell.display}</td>;
                })}</tr>
        )}</tbody>
    </table>;
};

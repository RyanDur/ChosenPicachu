import {Columns, Row} from './types';
import {FC} from 'react';
import {joinClassNames} from '../util';
import './Table.css';

export interface TableProps {
    columns: Columns;
    rows: Row[];
    id?: string;
    tableClassName?: string;
    theadClassName?: string;
    tbodyClassName?: string;
    trClassName?: string;
    thClassName?: string;
    tdClassName?: string;
    headerRowClassName?: string;
    rowClassName?: string;
    cellClassName?: string;
}

export const Table: FC<TableProps> = (
    {
        columns,
        rows,
        id,
        tableClassName,
        theadClassName,
        tbodyClassName,
        trClassName,
        thClassName,
        tdClassName,
        headerRowClassName,
        rowClassName,
        cellClassName
    }
) => {
    const headers = Object.entries(columns);
    return <table id={id} className={tableClassName} data-testid="table">
        <thead className={theadClassName} data-testid="thead">
        <tr className={joinClassNames(
            trClassName,
            headerRowClassName
        )} data-testid="tr">{headers.map(([header, {display, className}]) =>
            <th className={joinClassNames(thClassName, cellClassName, className)}
                key={header}
                scope="col"
                data-testid="th">
                {display}
            </th>
        )}</tr>
        </thead>
        <tbody className={tbodyClassName} data-testid="tbody">{rows.map((row, y) =>
            <tr className={joinClassNames(trClassName, rowClassName)} key={y} data-testid="tr">
                {headers.map(([column], x) => {
                    const cell = row[column];
                    return <td className={joinClassNames(tdClassName, cellClassName, cell.className)} key={x}
                               data-testid={`cell-${x}-${y}`}>
                        {cell.display}
                    </td>;
                })}</tr>
        )}</tbody>
    </table>;
};
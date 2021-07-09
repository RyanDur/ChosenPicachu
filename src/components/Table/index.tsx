import {Column, Row} from './types';
import {FC} from 'react';
import {joinClassNames} from '../util';
import './Table.css';

export interface TableProps {
    columns: Column[];
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
) => <table id={id} className={tableClassName} data-testid="table">
    <thead className={theadClassName} data-testid="thead">
    <tr className={joinClassNames(
        trClassName,
        headerRowClassName
    )} data-testid="tr">{columns.map(({display, column, className}) =>
        <th className={joinClassNames(thClassName, cellClassName, className)}
            key={column}
            scope="col"
            data-testid="th">
            {display}
        </th>
    )}</tr>
    </thead>
    <tbody className={tbodyClassName} data-testid="tbody">{rows.map((row, rowNumber) =>
        <tr className={joinClassNames(trClassName, rowClassName)} key={rowNumber} data-testid="tr">
            {columns.map(({column}, columnNumber) => {
                const cell = row[column];
                return <td className={joinClassNames(tdClassName, cellClassName, cell.className)} key={columnNumber}
                           data-testid={`cell-${columnNumber}-${rowNumber}`}>
                    {cell.display}
                </td>;
            })}</tr>
    )}</tbody>
</table>;
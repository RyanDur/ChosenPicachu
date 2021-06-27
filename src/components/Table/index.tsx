import {nanoid} from 'nanoid';
import {Column, Row} from './types';
import './Table.css';
import {FC} from 'react';

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

const join = (...names: Partial<string[]>) => names.join(' ').trim();

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
    }) =>
    <table id={id} className={tableClassName} data-testid="table">
        <thead className={theadClassName} data-testid="thead">
        <tr className={join(trClassName, headerRowClassName)} data-testid="tr">{columns.map(column =>
            <th className={join(thClassName, cellClassName)} key={nanoid()} scope="col" data-testid="th">
                {column.display || column.value}
            </th>
        )}</tr>
        </thead>
        <tbody className={tbodyClassName} data-testid="tbody">{rows.map((row, y) =>
            <tr className={join(trClassName, rowClassName)} key={nanoid()} data-testid="tr">
                {columns.map((column, x) => {
                    const cell = row[column.value];
                    return <td className={join(tdClassName, cellClassName)} key={nanoid()} data-testid={`cell-${x}-${y}`}>
                        {cell.display || cell.value}
                    </td>;
                })}</tr>
        )}</tbody>
    </table>;
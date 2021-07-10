import {Column, Row} from './types';
import {FC, useEffect} from 'react';
import {joinClassNames} from '../util';
import React, {useState} from 'react';
import {add, remove} from '../../util';
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
    }: TableProps) => {
    const [currentRows, setCurrentRows] = useState<Array<Row>>(rows);
    useEffect(() => setCurrentRows(rows), [rows]);
    return <table id={id} className={tableClassName} data-testid="table">
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
        <tbody className={tbodyClassName} data-testid="tbody">{currentRows.map((row, rowNumber) =>
            <tr className={joinClassNames(trClassName, rowClassName).trim()} data-index={rowNumber} key={rowNumber}
                data-testid="tr"
                draggable
                onDrag={event => event.currentTarget.classList.add('dragging')}
                onDragStart={event => {
                    event.dataTransfer.effectAllowed = 'move';
                    event.dataTransfer.setData('application/my-app', `${rowNumber}`);
                }}
                onDragOver={event => event.preventDefault()}
                onDragLeave={event => event.preventDefault()}
                onDragEnd={event => event.currentTarget.classList.remove('dragging')}
                onDrop={event => {
                    const index = +event.dataTransfer.getData('application/my-app');
                    const data = currentRows[index];
                    setCurrentRows(add(rowNumber, data, remove(index, currentRows)));
                }}>
                {columns.map(({column, className}, columnNumber) => {
                    const cell = row[column];
                    return <td className={joinClassNames(tdClassName, cellClassName, className, cell.className)} key={columnNumber}
                               data-testid={`cell-${columnNumber}-${rowNumber}`}>
                        {cell.display}
                    </td>;
                })}</tr>
        )}</tbody>
    </table>;
};
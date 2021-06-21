import {nanoid} from 'nanoid';
import {TableProps} from './types';
import './Table.css';

const join = (...names: Partial<string[]>) => names.join(' ').trim();

export const Table = <ROW_CELL_VALUE_TYPE extends Object>(
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
        rowClassName
    }: TableProps<ROW_CELL_VALUE_TYPE>) =>
    <table id={id} className={tableClassName} data-testid="table">
        <thead className={theadClassName} data-testid="thead">
        <tr className={join(trClassName, headerRowClassName)} data-testid="tr">{columns.map(column =>
            <th className={join(thClassName)} key={nanoid()} scope="col" data-testid="th">
                {column.display || column.name}
            </th>
        )}</tr>
        </thead>
        <tbody className={tbodyClassName} data-testid="tbody">{rows.map((row, y) =>
            <tr className={join(trClassName, rowClassName)} key={nanoid()} data-testid="tr">
                {columns.map((column, x) => {
                    const cell = row[column.name];
                    return <td className={join(tdClassName)}
                               data-testid={`column-${x}-row-${y}`}
                               key={nanoid()}>
                        {cell.display || cell.value}
                    </td>;
                })}</tr>
        )}</tbody>
    </table>;
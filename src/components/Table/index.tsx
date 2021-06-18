import {nanoid} from 'nanoid';
import {TableProps} from './types';
import './Table.css';

export const Table = <ROW_CELL_VALUE_TYPE extends Object>(
    {
        columns,
        rows,
        id,
        tableClassName,
        theadClassName,
        trClassName,
        thClassName,
        headerClassName,
        rowClassName,
        tdClassName
    }: TableProps<ROW_CELL_VALUE_TYPE>) =>
    <table id={id} className={['fancy-table', tableClassName].join(' ')} data-testid="table">
        <thead className={['header', theadClassName, headerClassName].join(' ')} data-testid="thead">
        <tr className={['row', trClassName].join(' ')} data-testid="tr">{columns.map(column =>
            <th className={['cell', thClassName].join(' ')} key={nanoid()} scope="col" data-testid="th">
                {column.display || column.name}
            </th>
        )}</tr>
        </thead>
        <tbody className='body'>{rows.map((row, y) =>
            <tr className={['row', trClassName, rowClassName].join(' ')} key={nanoid()} data-testid="tr">
                {columns.map((column, x) => {
                    const cell = row[column.name];
                    return <td className={['cell', tdClassName].join(' ')}
                               data-testid={`column-${x}-row-${y}`}
                               key={nanoid()}>
                        {cell.display || cell.value}
                    </td>;
                })}</tr>
        )}</tbody>
    </table>;
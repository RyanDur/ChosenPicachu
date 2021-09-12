import {Column, Row} from './types';
import {FC} from 'react';
import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from '@material-ui/core';

export interface TableProps {
    columns: Column[];
    rows: Row[];
    id?: string;
}

export const OldTable: FC<TableProps> = (
    {
        columns,
        rows,
        id
    }
) => <TableContainer component={Paper} id={id}>
    <Table data-testid="table">
        <TableHead data-testid="thead">
        <TableRow data-testid="tr">{columns.map(({display, column}) =>
            <TableCell key={column}
                scope="col"
                data-testid="th">
                {display}
            </TableCell>
        )}</TableRow>
        </TableHead>
        <TableBody data-testid="tbody">{rows.map((row, rowNumber) =>
            <TableRow key={rowNumber} data-testid="tr">
                {columns.map(({column}, columnNumber) => {
                    const cell = row[column];
                    return <TableCell key={columnNumber} data-testid={`cell-${columnNumber}-${rowNumber}`}>
                        {cell.display}
                    </TableCell>;
                })}</TableRow>
        )}</TableBody>
    </Table>
</TableContainer>;
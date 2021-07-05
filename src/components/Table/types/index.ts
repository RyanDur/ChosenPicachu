import {ReactNode} from 'react';

type ColumnValue = string | number;

export type Columns = {
    [column in ColumnValue]: Cell
}

export type Row = {
    [column in ColumnValue]: Cell;
};

export interface Cell {
    display: ReactNode;
    key?: ColumnValue;
    className?: string;
}
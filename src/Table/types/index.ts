import {ReactNode} from 'react';

export interface Column {
    name: string;
    display?: ReactNode;
}

export interface Row<T> {
    [column: string]: Cell<T>;
}

export interface Cell<T> {
    value: T;
    display?: ReactNode;
}

export interface TableProps<CELL> {
    columns: Column[];
    rows: Row<CELL>[];
    id?: string;
    tableClassName?: string;
    theadClassName?: string;
    trClassName?: string;
    thClassName?: string;
    headerClassName?: string;
    rowClassName?: string;
    tdClassName?: string;
}
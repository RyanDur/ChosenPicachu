import {ReactNode} from 'react';

type ColumnValue = string | number;

export type Column = Cell<ColumnValue>

export type Row = {
    [column in ColumnValue]: Cell;
};

export interface Cell<T = ReactNode> {
    value: T;
    display?: ReactNode;
    className?: string;
}
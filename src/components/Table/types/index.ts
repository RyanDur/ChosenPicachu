import {ReactNode} from 'react';

export type Column = Cell<string | number>

export interface Row {
    [column: string]: Cell;
}

export interface Cell<T = Object> {
    value: T;
    display?: ReactNode;
}
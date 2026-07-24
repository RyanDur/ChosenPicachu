import {ReactNode} from 'react';

export type Row = {
    [column in string | number]: Cell;
};

export type Column = Cell & { column: keyof Row; }

export type Cell = {
    display: ReactNode;
    className?: string;
}
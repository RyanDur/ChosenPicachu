import {ReactNode} from 'react';
import {DragStyle} from '../useTravel';

export type Row = {
    [column in string | number]: Cell;
};

export type Column = Cell & {
    column: keyof Row;
    width?: number;
}

export type Cell = {
    display: ReactNode;
    className?: string;
}
export type Dress = {
    tableClassName?: string;
    theadClassName?: string;
    tbodyClassName?: string;
    trClassName?: string;
    thClassName?: string;
    tdClassName?: string;
    headerRowClassName?: string;
    rowClassName?: string;
    cellClassName?: string;
};

export type TableProps = Dress & {
    columns: Column[];
    rows: Row[];
    draggableColumns?: DragStyle;
    draggableRows?: DragStyle;
    id?: string;
};

import {useState} from 'react';
import {RowData} from '@components/Table';
import {TableState, dealtTableState, standingOf} from './table-state';

export const useTableState = (
    order: readonly string[],
    rows: RowData[]
): [TableState, (transition: (state: TableState) => TableState) => void] => {
    const [state, setTableState] = useState<TableState>(() => dealtTableState(order, rows.length));
    const commit = (transition: (state: TableState) => TableState): void =>
        setTableState(current => {
            const next = transition(current);
            return {...next, seated: standingOf(rows, next)};
        });
    return [state, commit];
};

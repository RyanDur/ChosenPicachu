import {useState} from 'react';
import {RowData} from '@components/Table';
import {TableState, dealtTableState, standingOf} from './table-state';

export const useTableState = (
    order: readonly string[],
    rows: RowData[]
): [TableState, (transition: (state: TableState) => TableState) => void] => {
    const [state, setTableState] = useState<TableState>(() => dealtTableState(order, rows.length));

    const dealtIn = (current: TableState): TableState => {
        if (current.seats.length === rows.length) {
            return current;
        }
        const seats = rows.map((_, at) => at);
        return {...current, seats, seated: seats};
    };

    const commit = (transition: (state: TableState) => TableState): void =>
        setTableState(current => {
            const next = transition(dealtIn(current));
            return {...next, seated: standingOf(rows, next)};
        });

    return [dealtIn(state), commit];
};

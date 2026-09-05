import {useState} from 'react';
import {RowData} from '@components/Table';
import {TableStore, Transition, dealtIn, dealtTableState, seatedBy, tableStore} from './table-state';

export const useTableStore = (order: readonly string[], rows: RowData[]): TableStore => {
    const [store] = useState(() => tableStore(dealtTableState(order, rows.length)));

    const seated = (transition: Transition): Transition =>
        seatedBy(rows)(state => transition(dealtIn(rows.length)(state)));

    return {...store, commit: transition => store.commit(seated(transition))};
};

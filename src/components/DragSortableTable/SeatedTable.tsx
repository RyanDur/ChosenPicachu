import {FC, PropsWithChildren, useEffect, useState} from 'react';
import {Seated} from './context';
import {Values} from './sorting';
import {dealtIn, dealtTableState, tableStore} from './table-state';

export const SeatedTable: FC<PropsWithChildren<{columns: readonly string[]; values: readonly Values[]}>> = ({columns, values, children}) => {
    const [store] = useState(() => tableStore(dealtTableState(columns, values.length)));
    const lanes = values.length;

    useEffect(() => {
        if (store.state().seats.length !== lanes) {
            store.dispatch(dealtIn(lanes));
        }
    }, [store, lanes]);

    return <Seated.Provider value={{store, values}}>
        {children}
    </Seated.Provider>;
};

import {useState} from 'react';
import {TableProps} from '@components/Table';
import {Desk, dealtDesk, standingOf} from './desk';

export const useDesk = (
    order: readonly string[],
    rows: TableProps['rows']
): [Desk, (transition: (desk: Desk) => Desk) => void] => {
    const [desk, setDesk] = useState<Desk>(() => dealtDesk(order, rows.length));
    const commit = (transition: (desk: Desk) => Desk): void =>
        setDesk(current => {
            const next = transition(current);
            return {...next, seated: standingOf(rows, next)};
        });
    return [desk, commit];
};

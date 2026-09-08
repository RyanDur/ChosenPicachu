import {ComponentProps, ReactNode, useEffect, useState, useSyncExternalStore} from 'react';
import {Table, TableContext} from './context';
import {tableStore} from './store';
import {Labelled, Seated, tableOf} from './table-state';
import {seated as seating} from './actions';

type Props<C extends Labelled> = ComponentProps<'table'> & {
  columns: readonly {name: string; data: C}[];
  rows: readonly Seated[];
};

// the table element; it owns the arrangement and hands it, with the rows the page seated, to everything inside
export const DragSortableTable = <C extends Labelled>({columns, rows, children, ...table}: Props<C>): ReactNode => {
  const [store] = useState(() => tableStore(tableOf(columns, rows.map(({key}) => key))));
  const state = useSyncExternalStore(store.subscribe, () => store.state);

  useEffect(() => {
    store.dispatch(seating(rows.map(({key}) => key)));
  }, [store, rows]);

  const context: TableContext<C> = {state, seated: rows, dispatch: store.dispatch};

  return <Table.Provider value={context}>
    <table {...table}>{children}</table>
  </Table.Provider>;
};

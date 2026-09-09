import {ComponentProps, ReactNode, useState, useSyncExternalStore} from 'react';
import {Table, TableContext} from './context';
import {tableStore} from './store';
import {TableColumn, Labelled, Seated} from './table-state';

type Props<C extends Labelled> = ComponentProps<'table'> & {
  columns: readonly TableColumn<C>[];
  rows: readonly Seated[];
};

export const DragSortableTable = <C extends Labelled>({columns, rows, children, ...table}: Props<C>): ReactNode => {
  const [store] = useState(() => tableStore());
  const state = useSyncExternalStore(store.subscribe, () => store.state);

  const context: TableContext = {state, columns, rows, dispatch: store.dispatch};

  return <Table.Provider value={context}>
    <table {...table}>{children}</table>
  </Table.Provider>;
};

import {ComponentProps, ReactNode, useState, useSyncExternalStore} from 'react';
import {classNames} from '@components/class-names';
import {Table, TableContext} from './context';
import {tableStore} from './store';
import {MoveReport} from './MoveReport';
import {selectReport} from './selectors';
import {TableColumn, Labelled, Seated} from './table-state';
import './Table.css';
import './sortable.css';

export type Origin = 'keep' | 'hide';
export type Motion = 'animated' | 'static';

type Props<C extends Labelled> = ComponentProps<'table'> & {
  caption: string;
  origin: Origin;
  motion: Motion;
  columns: readonly TableColumn<C>[];
  rows: readonly Seated[];
};

export const DragSortableTable = <C extends Labelled>({caption, origin, motion, columns, rows, className, children, ...table}: Props<C>): ReactNode => {
  const [store] = useState(() => tableStore());
  const state = useSyncExternalStore(store.subscribe, () => store.state);

  const context: TableContext = {state, columns, rows, dispatch: store.dispatch};

  return <Table.Provider value={context}>
    <table {...table} className={classNames('fancy-table', 'sortable', 'apportioned', origin, motion, className)}>
      <caption className="off-screen">{caption}</caption>
      {children}
    </table>
    <MoveReport report={selectReport(context)}/>
  </Table.Provider>;
};

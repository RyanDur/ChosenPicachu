import {useState, useSyncExternalStore} from 'react';
import {classNames} from '@components/class-names';
import {Table, TableContext, TableView} from './context';
import {tableStore} from './store';
import {selectReport} from './selectors';
import {moveReport} from './report';
import {TableColumn, Labelled, Seated} from './table-state';
import './Table.css';
import './sortable.css';

export type Origin = 'keep' | 'hide';
export type Motion = 'animated' | 'static';

export type Choices = {
  readonly origin: Origin;
  readonly motion: Motion;
};

export type Sortable = TableContext & {
  readonly className: string;
};

export const useDragSortable = <C extends Labelled>(columns: readonly TableColumn<C>[], rows: readonly Seated[], {origin, motion}: Choices): Sortable => {
  const [hand] = useState(() => tableStore());
  const state = useSyncExternalStore(hand.subscribe, () => hand.state);
  return {state, columns, rows, dispatch: hand.dispatch, className: classNames('fancy-table', 'sortable', 'apportioned', origin, motion)};
};

export const DragSortable = Table.Provider;

export const reportOf = (sortable: TableView): string => selectReport(sortable).map(moveReport).orElse('');

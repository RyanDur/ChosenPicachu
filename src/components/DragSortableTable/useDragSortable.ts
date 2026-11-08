import {useState, useSyncExternalStore} from 'react';
import {classNames} from '../classNames';
import {TableContext} from './tableContexts';
import {Labelled, Seated, TableColumn, tableStore} from './model';
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

export const useDragSortable = <C extends Labelled>(
  columns: readonly TableColumn<C>[],
  rows: readonly Seated[],
  {origin, motion}: Choices
): Sortable => {
  const [hand] = useState(() => tableStore());
  const held = () => hand.state;
  const state = useSyncExternalStore(hand.subscribe, held, held);
  return {state, columns, rows, dispatch: hand.dispatch, className: classNames('fancy-table', 'sortable', 'apportioned', origin, motion)};
};

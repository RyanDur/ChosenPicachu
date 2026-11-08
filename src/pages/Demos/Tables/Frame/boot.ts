import {unconfigured} from '@transport';
import {arrangements} from '@components/DragSortableTable/model';
import type {Dials, Pace} from '../../Controls';
import {exchange, marketActions, marketSelectors, marketStore} from '@pages/Demos/Market';
import {builds} from './builds';

declare global {
  // augmenting Window only works through interface merging — a type alias cannot merge
  // oxlint-disable-next-line typescript/consistent-type-definitions
  interface Window {
    __frame?: Dials;
  }
}

const pace = (): Pace => window.__frame?.pace ?? 'eager';

const fed = (table: HTMLTableElement, told: Pace): void => {
  const page = marketStore(exchange({...unconfigured, ...window.__env}, () => undefined));
  const reconcile = builds[told](table, {
    columns: () => marketSelectors.columns(page.state),
    rows: () => marketSelectors.rows(page.state)
  });
  table.addEventListener('column-moved', ({detail: {column, to}}) => page.dispatch(arrangements.columnMoved(column, to)));
  table.addEventListener('row-moved', ({detail: {row, to, standing}}) => page.dispatch(arrangements.rowMoved(row, to, standing)));
  table.addEventListener('sorted', ({detail: {column, direction}}) => page.dispatch(arrangements.sorted(column, direction)));
  page.subscribe(previous => reconcile(marketSelectors.columns(previous)));
  reconcile([]);
  page.dispatch(marketActions.feedRequested());
};

const feed = (document: Document, told: Pace): void =>
  [...document.querySelectorAll('table[data-drag-sortable]')]
    .filter(table => table instanceof HTMLTableElement)
    .forEach(table => fed(table, told));

export const boot = (document: Document): void => {
  feed(document, pace());
};

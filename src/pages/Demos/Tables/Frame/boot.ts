import {unconfigured} from '@env';
import type {Dials, Pace} from '../../Controls';
import {exchange} from '@pages/Demos/exchange';
import {columnMoved, demosStore, feedRequested, rowMoved, selectColumns, selectRows, sorted} from './table/table-state';
import {DragSortableTable as EagerTable} from './builds/Eager';
import {DragSortableTable as LazyTable} from './builds/Lazy';
import {builds} from './builds';
import {enhancing} from './table/enhance';
import {rowGrip} from './table/grip';
import {resizeHandle} from './table/handle';
import {sortMenu} from './table/menus';

declare global {
  // augmenting Window only works through interface merging — a type alias cannot merge
  // oxlint-disable-next-line typescript/consistent-type-definitions
  interface Window {
    __frame?: Dials;
  }
}

export const pace = (): Pace => window.__frame?.pace ?? 'eager';

export const define = (told: Pace): void => {
  customElements.define('drag-sortable-table', builds[told]);
  customElements.define('row-grip', enhancing(rowGrip));
  customElements.define('resize-handle', enhancing(resizeHandle));
  customElements.define('sort-menu', enhancing(sortMenu));
};

export const feed = (document: Document): void => {
  const table = document.querySelector('drag-sortable-table');
  if (!(table instanceof EagerTable || table instanceof LazyTable)) {
    return;
  }
  const page = demosStore(exchange({...unconfigured, ...window.__env}, () => undefined));
  const show = (): void => {
    table.columns = selectColumns(page.state);
    table.rows = selectRows(page.state);
  };
  table.addEventListener('column-moved', ({detail: {column, to}}) => page.dispatch(columnMoved(column, to)));
  table.addEventListener('row-moved', ({detail: {row, to, standing}}) => page.dispatch(rowMoved(row, to, standing)));
  table.addEventListener('sorted', ({detail: {column, direction}}) => page.dispatch(sorted(column, direction)));
  page.subscribe(show);
  show();
  page.dispatch(feedRequested());
};

export const boot = (document: Document): void => {
  define(pace());
  feed(document);
};

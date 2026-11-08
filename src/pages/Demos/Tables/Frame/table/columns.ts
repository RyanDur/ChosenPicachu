import {is, maybe} from '@ryandur/sand';
import {survey} from '@components/DragSortableTable/model';
import {changed, columnOfHeader, MountedTable} from './table-state';
import {keepingFocus} from './focus';
import {dressWidths} from './resize';

export const headersOf = (table: HTMLTableElement): HTMLTableCellElement[] =>
  [...table.querySelectorAll('thead th')].filter(th => th instanceof HTMLTableCellElement);

export const columnsShown = (table: HTMLTableElement): string[] => headersOf(table).map(columnOfHeader);

export const sortableOf = (table: HTMLTableElement): string[] =>
  columnsShown(table).filter(column => is(table.querySelector(`#sort-${column}`)));

export const markGrips = (table: HTMLTableElement): void => {
  const headers = headersOf(table);
  headers.forEach((th, at) => {
    if (survey.anchored(at, headers.length)) {
      th.classList.remove('grabbable');
      th.removeAttribute('tabindex');
    } else {
      th.classList.add('grabbable');
      th.tabIndex = 0;
    }
  });
};

const reconcileColumns = (table: HTMLTableElement, shown: readonly string[], order: readonly string[]): void => {
  [...table.rows].forEach(lane => {
    const placed = new Map(shown.map((name, at) => [name, lane.cells[at]]));
    order.forEach((name, position) =>
      maybe(placed.get(name)).map(cell => {
        if (lane.cells[position] !== cell) {
          lane.insertBefore(cell, lane.cells[position] ?? null);
        }
      }));
  });
};

export const arrangeColumns = (context: Pick<MountedTable, 'table' | 'store' | 'order'>): void => {
  const {table, order} = context;
  const shown = columnsShown(table);
  if (changed(shown, order())) {
    keepingFocus(maybe(table.ownerDocument.activeElement), () => reconcileColumns(table, shown, order()));
    markGrips(table);
    dressWidths(context);
  }
};

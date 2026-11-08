import {is, maybe} from '@ryandur/sand';
import {survey} from '@components/DragSortableTable/model';
import {MountedTable, mountedTable} from './table-state';
import {orders} from './orders';
import {keepingFocus} from './focus';
import {dressWidths} from './resize';

const headers = (table: HTMLTableElement): HTMLTableCellElement[] =>
  [...table.querySelectorAll('thead th')].filter(th => th instanceof HTMLTableCellElement);

const shown = (table: HTMLTableElement): string[] => headers(table).map(mountedTable.columnOfHeader);

const sortable = (table: HTMLTableElement): string[] =>
  shown(table).filter(column => is(table.querySelector(`#sort-${column}`)));

const markGrips = (table: HTMLTableElement): void => {
  const all = headers(table);
  all.forEach((th, at) => {
    if (survey.anchored(at, all.length)) {
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

const arrange = (context: Pick<MountedTable, 'table' | 'store' | 'order'>): void => {
  const {table, order} = context;
  const onPage = shown(table);
  if (orders.differ(onPage, order())) {
    keepingFocus(maybe(table.ownerDocument.activeElement), () => reconcileColumns(table, onPage, order()));
    markGrips(table);
    dressWidths(context);
  }
};

export const frameColumns = {
  headers,
  shown,
  sortable,
  markGrips,
  arrange
};

import {maybe} from '@ryandur/sand';
import {shares, tableState} from '@components/DragSortableTable/model';
import {MountedTable} from './table-state';

const dressColumn = (table: HTMLTableElement, column: string, share: number, named: number): void => {
  maybe(table.querySelector(`th[data-column="${column}"]`)).map(header => {
    if (!(header instanceof HTMLTableCellElement)) {
      return;
    }
    header.classList.add('shared');
    header.style.setProperty('--share', `${share}%`);
    maybe(header.querySelector('[data-resize-handle]')).map(handle =>
      handle.setAttribute('aria-label', shares.resizeLabel(column, named)));
  });
};

export const dressWidths = ({table, store, order}: Pick<MountedTable, 'table' | 'store' | 'order'>): void => {
  maybe(tableState.widthsOf(store.state)).map(widths => {
    table.classList.add('apportioned');
    order().forEach(column =>
      dressColumn(table, column, widths[column], tableState.namedShare(store.state, column) ?? widths[column]));
  });
};

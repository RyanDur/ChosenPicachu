import {maybe} from '@ryandur/sand';
import {resizeLabel} from '@components/Table/shares';
import {MountedTable, namedShare, widthsOf} from './table-state';

const dressColumn = (table: HTMLTableElement, column: string, share: number, named: number): void => {
  maybe(table.querySelector(`th.${column}`)).map(header => {
    if (!(header instanceof HTMLTableCellElement)) {
      return;
    }
    header.classList.add('shared');
    header.style.setProperty('--share', `${share}%`);
    maybe(header.querySelector('.resize-handle')).map(handle =>
      handle.setAttribute('aria-label', resizeLabel(column, named)));
  });
};

export const dressWidths = ({table, store, order}: Pick<MountedTable, 'table' | 'store' | 'order'>): void => {
  maybe(widthsOf(store.state)).map(widths => {
    table.classList.add('apportioned');
    order().forEach(column => dressColumn(table, column, widths[column], namedShare(store.state, column) ?? widths[column]));
  });
};

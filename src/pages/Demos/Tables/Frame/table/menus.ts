import {has, maybe} from '@ryandur/sand';
import {Direction, directionOf} from '@components/DragSortableTable/sorting';
import {Labelled, TableColumn} from '@components/DragSortableTable/table-state';
import {MountedTable} from './table-state';

export const announce = (table: ParentNode, column: string, sorted?: Direction): void => {
  maybe(table.querySelector(`th.${column}`)).map(header => {
    if (has(sorted)) {
      header.setAttribute('aria-sort', sorted);
    } else {
      header.removeAttribute('aria-sort');
    }
  });
};

export const wireMenu = (table: ParentNode, column: string, choose: (direction?: Direction) => void): void => {
  maybe(table.querySelector(`#sort-${column}`)).map(menu =>
    [...menu.querySelectorAll('button.item')].forEach(item =>
      item.addEventListener('click', () => choose(directionOf((item.textContent ?? '').trim())))));
};

const sortOf = (columns: readonly TableColumn<Labelled>[]): string =>
  columns.map(({name, sorted}) => has(sorted) ? `${name} ${sorted}` : '').join('');

export const announceSort = ({table, columns}: MountedTable, before: readonly TableColumn<Labelled>[]): void => {
  if (sortOf(before) !== sortOf(columns())) {
    columns().forEach(({name, sorted}) => announce(table, name, sorted));
  }
};

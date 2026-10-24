import {has, maybe} from '@ryandur/sand';
import {Direction, directionOf} from '@components/DragSortableTable/sorting';
import {Labelled, TableColumn} from '@components/DragSortableTable/table-state';
import {columnOfHeader, MountedTable} from './table-state';
import {tell} from './events';

export const announce = (table: ParentNode, column: string, sorted?: Direction): void => {
  maybe(table.querySelector(`th.${column}`)).map(header => {
    if (has(sorted)) {
      header.setAttribute('aria-sort', sorted);
    } else {
      header.removeAttribute('aria-sort');
    }
  });
};

const sortOf = (columns: readonly TableColumn<Labelled>[]): string =>
  columns.map(({name, sorted}) => has(sorted) ? `${name} ${sorted}` : '').join('');

export const announceSort = ({table, columns}: Pick<MountedTable, 'table' | 'columns'>, before: readonly TableColumn<Labelled>[]): void => {
  if (sortOf(before) !== sortOf(columns())) {
    columns().forEach(({name, sorted}) => announce(table, name, sorted));
  }
};

export const choose = ({table, report}: Pick<MountedTable, 'table' | 'report'>, column: string, direction?: Direction): void => {
  tell(table, 'sorted', {column, direction});
  report({about: 'sort', name: column, direction});
};

const choosing = (context: Pick<MountedTable, 'table' | 'report'>, column: string, item: Element): void => {
  item.addEventListener('click', () => choose(context, column, directionOf((item.textContent ?? '').trim())));
};

const keepingTheColumnStill = (chrome: Element): void => {
  chrome.addEventListener('pointerdown', event => event.stopPropagation());
};

export const sortMenu = (context: Pick<MountedTable, 'table' | 'report'>, menu: HTMLElement): void => {
  maybe(menu.closest('th')).map(th => {
    menu.querySelectorAll('button').forEach(item => choosing(context, columnOfHeader(th), item));
    [menu, ...th.querySelectorAll('[data-sort-toggle]')].forEach(keepingTheColumnStill);
  });
};

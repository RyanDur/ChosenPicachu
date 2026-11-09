import {has, maybe} from '@ryandur/sand';
import {Direction, Labeled, TableColumn, sorting} from '@components/DragSortableTable/model';
import {MountedTable, mountedTable} from './table-state';
import {tell} from './events';

const announce = (table: ParentNode, column: string, sorted?: Direction): void => {
  maybe(table.querySelector(`th[data-column="${column}"]`)).map(header => {
    if (has(sorted)) {
      header.setAttribute('aria-sort', sorted);
    } else {
      header.removeAttribute('aria-sort');
    }
  });
};

const sortOf = (columns: readonly TableColumn<Labeled>[]): string =>
  columns.map(({name, sorted}) => has(sorted) ? `${name} ${sorted}` : '').join('');

const announceChanged = ({table, columns}: Pick<MountedTable, 'table' | 'columns'>, before: readonly TableColumn<Labeled>[]): void => {
  if (sortOf(before) !== sortOf(columns())) {
    columns().forEach(({name, sorted}) => announce(table, name, sorted));
  }
};

const choose = ({table, report}: Pick<MountedTable, 'table' | 'report'>, column: string, direction?: Direction): void => {
  tell(table, 'sorted', {column, direction});
  report({about: 'sort', name: column, direction});
};

const choosing = (context: Pick<MountedTable, 'table' | 'report'>, column: string, item: HTMLButtonElement): void => {
  item.addEventListener('click', () => sorting.choiceOf(item.value)
    .map(choice => choose(context, column, sorting.directionOf(choice))));
};

const keepingTheColumnStill = (chrome: Element): void => {
  chrome.addEventListener('pointerdown', event => event.stopPropagation());
};

const wire = (context: Pick<MountedTable, 'table' | 'report'>, menu: HTMLElement): void => {
  maybe(menu.closest('th')).map(th => {
    menu.querySelectorAll('button').forEach(item => choosing(context, mountedTable.columnOfHeader(th), item));
    [menu, ...th.querySelectorAll('[data-sort-toggle]')].forEach(keepingTheColumnStill);
  });
};

export const sortMenus = {
  announce,
  announceChanged,
  choose,
  wire
};

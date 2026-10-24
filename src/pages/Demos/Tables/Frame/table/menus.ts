import {has, maybe} from '@ryandur/sand';
import {Direction, directionOf} from '@components/DragSortableTable/sorting';
import {Labelled, TableColumn} from '@components/DragSortableTable/table-state';
import {columnOfHeader, MountedTable} from './table-state';
import {tell} from './events';
import {contextOf} from './context';
import {listen, nothingToUndo, Undo, undoingAll} from './undo';

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

const choosing = (host: HTMLElement, column: string, item: HTMLElement): Undo =>
  listen(item, 'click', () => contextOf(host).map(context => choose(context, column, directionOf((item.textContent ?? '').trim()))));

const keepingTheColumnStill = (chrome: HTMLElement): Undo =>
  listen(chrome, 'pointerdown', event => event.stopPropagation());

export const sortMenu = (host: HTMLElement): Undo =>
  maybe(host.closest('th')).map(th => undoingAll([
    ...[...host.querySelectorAll('button.item')].filter(item => item instanceof HTMLElement).map(item => choosing(host, columnOfHeader(th), item)),
    ...[...host.querySelectorAll('.menu-toggle, .menu')].filter(chrome => chrome instanceof HTMLElement).map(keepingTheColumnStill)
  ])).orElse(nothingToUndo);

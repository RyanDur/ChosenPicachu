import {TableContext} from './context';
import {rowGrip} from './grip';
import {resizeHandle} from './handle';
import {sortMenu} from './menus';

const marked = (table: HTMLTableElement, mark: string): HTMLElement[] =>
  [...table.querySelectorAll(`[${mark}]`)].filter(part => part instanceof HTMLElement);

export const wireParts = (context: TableContext): void => {
  marked(context.table, 'data-row-grip').forEach(grip => rowGrip(context, grip));
  marked(context.table, 'data-resize-handle').forEach(handle => resizeHandle(context, handle));
  marked(context.table, 'data-sort-menu').forEach(menu => sortMenu(context, menu));
};

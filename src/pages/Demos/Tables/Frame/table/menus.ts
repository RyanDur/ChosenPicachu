import {has, maybe} from '@ryandur/sand';
import {Rule, directionOf, sortedBy} from '@components/DragSortableTable/sorting';

export const announce = (document: Document, column: string, rule?: Rule): void => {
  maybe(document.querySelector(`th.${column}`)).map(header => {
    const sorted = sortedBy(column, rule);
    if (has(sorted)) {
      header.setAttribute('aria-sort', sorted);
    } else {
      header.removeAttribute('aria-sort');
    }
  });
};

export const wireMenu = (document: Document, column: string, choose: (rule?: Rule) => void): void => {
  maybe(document.getElementById(`sort-${column}`)).map(menu =>
    [...menu.querySelectorAll('button.item')].forEach(item =>
      item.addEventListener('click', () => {
        const direction = directionOf((item.textContent ?? '').trim());
        choose(has(direction) ? {column, direction} : undefined);
      })));
};

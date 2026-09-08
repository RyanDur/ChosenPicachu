import {has, maybe} from '@ryandur/sand';
import {Direction, directionOf} from '@components/DragSortableTable/sorting';

export const announce = (document: Document, column: string, sorted?: Direction): void => {
  maybe(document.querySelector(`th.${column}`)).map(header => {
    if (has(sorted)) {
      header.setAttribute('aria-sort', sorted);
    } else {
      header.removeAttribute('aria-sort');
    }
  });
};

export const wireMenu = (document: Document, column: string, choose: (direction?: Direction) => void): void => {
  maybe(document.getElementById(`sort-${column}`)).map(menu =>
    [...menu.querySelectorAll('button.item')].forEach(item =>
      item.addEventListener('click', () => choose(directionOf((item.textContent ?? '').trim())))));
};

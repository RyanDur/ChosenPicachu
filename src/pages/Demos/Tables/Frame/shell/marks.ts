import {maybe} from '@ryandur/sand';
import {Shifted, Slid} from '@components/DragSortableTable/survey';
import {Shell} from './desk';

const shedMarks = (element: HTMLElement, name: string): void => {
  element.addEventListener('animationend', event => {
    if (event.animationName === name) {
      element.classList.remove(name);
      element.style.removeProperty('--carried');
      element.style.removeProperty('--toward');
      element.style.removeProperty('--drop');
    }
  }, {once: true});
};

const markCell = (cell: Element, mark: {toward: 'left' | 'right'; by: number}): void => {
  if (cell instanceof HTMLElement) {
    cell.style.setProperty('--carried', `${mark.by}px`);
    cell.style.setProperty('--toward', mark.toward === 'left' ? '1' : '-1');
    cell.classList.add('displaced');
    shedMarks(cell, 'displaced');
  }
};

export const markColumns = (shell: Shell, marks: Slid): void => {
  const {order} = shell.desk();
  Object.entries(marks).forEach(([column, mark]) => {
    const at = order.indexOf(column);
    maybe(shell.table.querySelector(`th.${column}`)).map(header => markCell(header, mark));
    shell.lanes.forEach(lane => markCell(lane.cells[at], mark));
  });
};

export const markRows = ({lanes}: Shell, drops: Shifted): void => {
  Object.entries(drops).forEach(([row, drop]) =>
    maybe(lanes[Number(row)]).map(lane => {
      lane.style.setProperty('--drop', `${drop}px`);
      lane.classList.add('shifted');
      shedMarks(lane, 'shifted');
    }));
};

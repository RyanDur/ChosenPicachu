import {maybe} from '@ryandur/sand';
import {Shell} from './desk';

export type GhostFlight = {
  element: HTMLTableElement;
  drift: (x: number, y: number) => void;
  land: () => void;
};

const summoned = (document: Document, id: string): HTMLTemplateElement => {
  const template = document.getElementById(id);
  if (!(template instanceof HTMLTemplateElement)) {
    throw new Error(`no template "${id}" in the page`);
  }
  return template;
};

const summonedTable = (document: Document, id: string): HTMLTableElement => {
  const clone = summoned(document, id).content.cloneNode(true);
  const element = clone instanceof DocumentFragment ? clone.firstElementChild : clone;
  if (!(element instanceof HTMLTableElement)) {
    throw new Error(`template "${id}" holds no table`);
  }
  return element;
};

const flown = (document: Document, element: HTMLTableElement, at: {x: number; y: number; width: number}): GhostFlight => {
  element.style.setProperty('--flight-x', `${at.x}px`);
  element.style.setProperty('--flight-y', `${at.y}px`);
  element.style.setProperty('--flight-width', `${at.width}px`);
  element.style.setProperty('--drift-x', '0px');
  element.style.setProperty('--drift-y', '0px');
  document.body.append(element);
  return {
    element,
    drift: (x, y) => {
      element.style.setProperty('--drift-x', `${x}px`);
      element.style.setProperty('--drift-y', `${y}px`);
    },
    land: () => element.remove()
  };
};

export const columnGhost = (shell: Shell, column: string): GhostFlight => {
  const {document, table, lanes} = shell;
  const at = shell.desk().order.indexOf(column);
  const th = maybe(table.querySelector(`th.${column}`)).orElse(table);
  const ghost = summonedTable(document, 'column-ghost');
  maybe(ghost.querySelector('th')).map(header => header.classList.add(column));
  maybe(ghost.querySelector('.header-cell-content')).map(content => {
    content.textContent = column;
  });
  [...ghost.querySelectorAll('tbody td')].forEach((td, seat) =>
    maybe(lanes[seat]).map(lane => {
      const cell = lane.cells[at];
      td.textContent = (cell.textContent ?? '').trim();
      if (td instanceof HTMLElement) {
        td.style.height = `${cell.getBoundingClientRect().height}px`;
      }
    }));
  const box = th.getBoundingClientRect();
  return flown(document, ghost, {x: box.x, y: box.y, width: box.width});
};

export const rowGhost = ({document, lanes}: Shell, row: number): GhostFlight => {
  const lane = lanes[row];
  const ghost = summonedTable(document, 'row-ghost');
  maybe(ghost.querySelector('tr')).map(seat =>
    [...seat.children].forEach((cell, at) => {
      if (!(cell instanceof HTMLTableCellElement)) {
        return;
      }
      cell.style.width = `${lane.cells[at].getBoundingClientRect().width}px`;
      const text = (lane.cells[at].textContent ?? '').trim();
      if (at === 0) {
        maybe(cell.querySelector('.row-header-content')).map(content => content.append(text));
      } else {
        cell.textContent = text;
      }
    }));
  const box = lane.getBoundingClientRect();
  return flown(document, ghost, {x: box.x, y: box.y, width: box.width});
};

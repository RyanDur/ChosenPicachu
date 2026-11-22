import {maybe, not} from '@ryandur/sand';
import {grip} from '@components/DragSortableTable/model';
import {cells, Measure, Moved} from '@pages/Demos/Market';
import {MountedTable} from './table-state';
import {orders} from './orders';
import {keepingFocus} from './focus';
import {frameColumns} from './columns';

const named = (lane: HTMLTableRowElement): string =>
  maybe(lane.querySelector('th')).mBind(header => maybe(header.textContent)).map(text => text.trim()).orElse('');

const lanes = (body: HTMLTableSectionElement): ReadonlyMap<string, HTMLTableRowElement> =>
  new Map([...body.rows].map(lane => [named(lane), lane]));

const directionWord = (cell: HTMLTableCellElement, direction: Moved): HTMLSpanElement => {
  const word = cell.ownerDocument.createElement('span');
  word.className = 'off-screen';
  word.textContent = direction;
  return word;
};

const writeCell = (cell: HTMLTableCellElement, {display, moved}: Measure): void => {
  if (cell.firstChild?.textContent === display && cell.dataset.moved === moved) {
    return;
  }
  maybe(moved).either(
    direction => {
      cell.replaceChildren(display, ' ', directionWord(cell, direction));
      cell.dataset.moved = direction;
    },
    () => {
      cell.replaceChildren(display);
      cell.removeAttribute('data-moved');
    });
};

const writeCells = ({table, lanes, rows}: Pick<MountedTable, 'table' | 'lanes' | 'rows'>): void => {
  const order = frameColumns.shown(table);
  rows().forEach(row =>
    maybe(lanes.get(row.lookback.display)).map(lane =>
      frameColumns.sortable(table).forEach(measure => {
        const cell = lane.cells[order.indexOf(measure)];
        const shown: Measure = cells.isMeasure(measure) ? row[measure] : {display: ''};
        writeCell(cell, shown);
      })));
};

const reseat = ({body, lanes, standing}: Pick<MountedTable, 'body' | 'lanes' | 'standing'>): void => {
  const next = standing();
  if (not(orders.differ([...body.rows].map(named), next))) {
    return;
  }
  keepingFocus(maybe(body.ownerDocument.activeElement), () =>
    next.forEach((row, seat) =>
      maybe(lanes.get(row)).map(desired => {
        if (body.children[seat] !== desired) {
          body.insertBefore(desired, maybe(body.children[seat]).orNull());
        }
      })));
  next.forEach((row, seat) =>
    maybe(lanes.get(row)).mBind(lane => maybe(lane.querySelector('[data-row-grip]'))).map(button => {
      const label = grip.label(seat);
      if (button.getAttribute('aria-label') !== label) {
        button.setAttribute('aria-label', label);
      }
    }));
};

export const frameRows = {
  named,
  lanes,
  writeCells,
  reseat
};

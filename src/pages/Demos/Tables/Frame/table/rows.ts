import {maybe, not} from '@ryandur/sand';
import {grip} from '@components/DragSortableTable/model';
import {cells} from '@pages/Demos/Market';
import {MountedTable} from './table-state';
import {orders} from './orders';
import {keepingFocus} from './focus';
import {frameColumns} from './columns';

const named = (lane: HTMLTableRowElement): string => lane.querySelector('th')?.textContent?.trim() ?? '';

const lanes = (body: HTMLTableSectionElement): ReadonlyMap<string, HTMLTableRowElement> =>
  new Map([...body.rows].map(lane => [named(lane), lane]));

const writeCells = ({table, lanes, rows}: Pick<MountedTable, 'table' | 'lanes' | 'rows'>): void => {
  const order = frameColumns.shown(table);
  rows().forEach(row =>
    maybe(lanes.get(row.lookback.display)).map(lane =>
      frameColumns.sortable(table).forEach(measure => {
        const text = cells.isMeasure(measure) ? row[measure].display : '';
        const cell = lane.cells[order.indexOf(measure)];
        if (cell.textContent !== text) {
          cell.textContent = text;
        }
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
          body.insertBefore(desired, body.children[seat] ?? null);
        }
      })));
  next.forEach((row, seat) =>
    maybe(lanes.get(row)?.querySelector('[data-row-grip]')).map(button => {
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

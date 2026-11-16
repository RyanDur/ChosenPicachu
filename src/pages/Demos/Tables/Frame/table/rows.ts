import {maybe, not} from '@ryandur/sand';
import {grip} from '@components/DragSortableTable/model';
import {cells} from '@pages/Demos/Market';
import {MountedTable} from './table-state';
import {orders} from './orders';
import {keepingFocus} from './focus';
import {frameColumns} from './columns';

const named = (lane: HTMLTableRowElement): string =>
  maybe(lane.querySelector('th')).mBind(header => maybe(header.textContent)).map(text => text.trim()).orElse('');

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

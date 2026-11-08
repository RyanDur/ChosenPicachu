import {maybe} from '@ryandur/sand';
import {grip} from '@components/DragSortableTable/model';
import {isMeasure} from '@pages/Demos/Market';
import {MountedTable, mountedTable} from './table-state';
import {keepingFocus} from './focus';
import {frameColumns} from './columns';

const of = (lane: HTMLTableRowElement): string => lane.querySelector('th')?.textContent?.trim() ?? '';

const lanes = (body: HTMLTableSectionElement): ReadonlyMap<string, HTMLTableRowElement> =>
  new Map([...body.rows].map(lane => [of(lane), lane]));

const writeCells = ({table, lanes, rows}: Pick<MountedTable, 'table' | 'lanes' | 'rows'>): void => {
  const order = frameColumns.shown(table);
  rows().forEach(row =>
    maybe(lanes.get(row.window.display)).map(lane =>
      frameColumns.sortable(table).forEach(measure => {
        const text = isMeasure(measure) ? row[measure].display : '';
        const cell = lane.cells[order.indexOf(measure)];
        if (cell.textContent !== text) {
          cell.textContent = text;
        }
      })));
};

const reseat = ({body, lanes, standing}: Pick<MountedTable, 'body' | 'lanes' | 'standing'>): void => {
  const next = standing();
  if (!mountedTable.changed([...body.rows].map(of), next)) {
    return;
  }
  keepingFocus(maybe(body.ownerDocument.activeElement), () =>
    next.forEach((row, position) =>
      maybe(lanes.get(row)).map(desired => {
        if (body.children[position] !== desired) {
          body.insertBefore(desired, body.children[position] ?? null);
        }
      })));
  next.forEach((row, position) =>
    maybe(lanes.get(row)?.querySelector('button.grip')).map(button => {
      const label = grip.label(position);
      if (button.getAttribute('aria-label') !== label) {
        button.setAttribute('aria-label', label);
      }
    }));
};

export const frameRows = {
  of,
  lanes,
  writeCells,
  reseat
};

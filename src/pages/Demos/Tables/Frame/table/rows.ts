import {maybe} from '@ryandur/sand';
import {gripLabel} from '@components/DragSortableTable/survey';
import {isMeasure} from '@pages/Demos/Tables/Aggregations/cells';
import {changed, columnOfHeader, MountedTable} from './table-state';
import {keepingFocus} from './focus';
import {headersOf, sortableOf} from './columns';

export const rowOf = (lane: HTMLTableRowElement): string => lane.querySelector('th')?.textContent?.trim() ?? '';

export const lanesOf = (body: HTMLTableSectionElement): ReadonlyMap<string, HTMLTableRowElement> =>
  new Map([...body.rows].map(lane => [rowOf(lane), lane]));

export const writeCells = ({table, lanes, rows}: Pick<MountedTable, 'table' | 'lanes' | 'rows'>): void => {
  const order = headersOf(table).map(columnOfHeader);
  rows().forEach(row =>
    maybe(lanes.get(row.window.display)).map(lane =>
      sortableOf(table).forEach(measure => {
        const text = isMeasure(measure) ? row[measure].display : '';
        const cell = lane.cells[order.indexOf(measure)];
        if (cell.textContent !== text) {
          cell.textContent = text;
        }
      })));
};

export const reseatRows = ({body, lanes, standing}: Pick<MountedTable, 'body' | 'lanes' | 'standing'>): void => {
  const next = standing();
  if (!changed([...body.rows].map(rowOf), next)) {
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
    maybe(lanes.get(row)?.querySelector('button.grip')).map(grip => {
      const label = gripLabel(position);
      if (grip.getAttribute('aria-label') !== label) {
        grip.setAttribute('aria-label', label);
      }
    }));
};

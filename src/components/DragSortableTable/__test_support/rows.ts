import {fireEvent, within} from '@testing-library/react';

export const sortableTable = {
  texts: (row: HTMLElement): (string | null)[] =>
    [within(row).getByRole('rowheader'), ...within(row).getAllByRole('cell')].map(cell => cell.textContent)
};

export const rect = (box: Partial<DOMRect>): DOMRect => ({
  left: 0, right: 0, top: 0, bottom: 0, width: 0, height: 0, x: 0, y: 0, toJSON: () => ({}), ...box
});

const HEAD = 40;
const ROW = 40;

// jsdom lays nothing out, so the rows are measured as 40px lanes under a 40px header
export const rowsLaidOut = (table: HTMLTableElement): void => {
  [...(table.tBodies[0]?.rows ?? [])].forEach((lane, at) => {
    lane.getBoundingClientRect = () => rect({left: 0, right: 700, width: 700, top: HEAD + at * ROW, y: HEAD + at * ROW, bottom: HEAD + (at + 1) * ROW, height: ROW});
  });
};

// a drag surveys the table too: its box and even column widths
export const tableSurveyed = (table: HTMLTableElement): void => {
  const height = HEAD + (table.tBodies[0]?.rows.length ?? 0) * ROW;
  table.getBoundingClientRect = () => rect({left: 0, right: 700, width: 700, top: 0, bottom: height, height});
  within(table).getAllByRole('columnheader').forEach(head => {
    head.getBoundingClientRect = () => rect({width: 100});
  });
  rowsLaidOut(table);
};

export const rowDrag = {
  lift: (grip: Element, from: number): void => {
    fireEvent.pointerDown(grip, {clientX: 100, clientY: HEAD + from * ROW + 10, pointerId: 1});
  },
  carryOver: (grip: Element, from: number, to: number): void => {
    const past = to < from ? 10 : 30;
    fireEvent.pointerMove(grip, {buttons: 1, clientX: 100, clientY: HEAD + to * ROW + past, pointerId: 1});
  },
  drop: (grip: Element): void => {
    fireEvent.pointerUp(grip, {pointerId: 1});
  }
};

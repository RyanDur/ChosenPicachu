import {within} from '@testing-library/react';

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

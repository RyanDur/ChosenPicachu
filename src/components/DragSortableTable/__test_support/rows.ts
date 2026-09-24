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

// a row drag reads the table's box and the rows; the columns can stand wherever the spec put them
export const rowsSurveyed = (table: HTMLTableElement): void => {
  const height = HEAD + (table.tBodies[0]?.rows.length ?? 0) * ROW;
  table.getBoundingClientRect = () => rect({left: 0, right: 700, width: 700, top: 0, bottom: height, height});
  rowsLaidOut(table);
};

export type RowInHand = {
  readonly carryStarted: () => void;
  readonly carriedOver: (from: number, to: number) => void;
  readonly carriedOn: (by: number) => void;
  readonly captureLost: () => void;
  readonly dropped: () => void;
};

const emptyHanded = (): never => {
  throw new Error('no row is in hand');
};

export const noRowInHand: RowInHand = {carryStarted: emptyHanded, carriedOver: emptyHanded, carriedOn: emptyHanded, captureLost: emptyHanded, dropped: emptyHanded};

// presses the grip in its row's lane and hands back the drag, which keeps the pointer where it last moved
export const liftedRow = (grip: Element, at: number): RowInHand => {
  let y = HEAD + at * ROW + 10;
  const laneOf = (from: number, to: number): number => HEAD + to * ROW + (to < from ? 10 : 30);
  const moveTo = (next: number): void => {
    y = next;
    fireEvent.pointerMove(grip, {buttons: 1, clientX: 100, clientY: y, pointerId: 1});
  };
  fireEvent.pointerDown(grip, {clientX: 100, clientY: y, pointerId: 1});
  return {
    // the drag takes its origin from the first move, not the press
    carryStarted: () => moveTo(y),
    carriedOver: (from, to) => moveTo(laneOf(from, to)),
    carriedOn: by => moveTo(y + by),
    captureLost: () => fireEvent.lostPointerCapture(grip, {buttons: 1, clientX: 100, clientY: y, pointerId: 1}),
    dropped: () => fireEvent.pointerUp(grip, {pointerId: 1})
  };
};

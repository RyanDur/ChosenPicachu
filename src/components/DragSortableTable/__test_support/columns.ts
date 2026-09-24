import {fireEvent} from '@testing-library/react';

export type ColumnInHand = {
  readonly carryStarted: () => void;
  readonly carriedTo: (x: number) => void;
  readonly carriedOn: (by: {x?: number; y?: number}) => void;
  readonly captureLostAt: (x: number) => void;
  readonly dropped: () => void;
};

const HEADER_Y = 20;

const emptyHanded = (): never => {
  throw new Error('no column is in hand');
};

export const noColumnInHand: ColumnInHand = {carryStarted: emptyHanded, carriedTo: emptyHanded, carriedOn: emptyHanded, captureLostAt: emptyHanded, dropped: emptyHanded};

export const liftedColumn = (header: Element, x: number): ColumnInHand => {
  const pointer = {x, y: HEADER_Y};
  const moveTo = (next: {x: number; y: number}): void => {
    pointer.x = next.x;
    pointer.y = next.y;
    fireEvent.pointerMove(header, {buttons: 1, clientX: pointer.x, clientY: pointer.y, pointerId: 1});
  };
  fireEvent.pointerDown(header, {clientX: pointer.x, clientY: pointer.y, pointerId: 1});
  return {
    // the drag takes its origin from the first move, not the press
    carryStarted: () => moveTo(pointer),
    carriedTo: next => moveTo({x: next, y: pointer.y}),
    captureLostAt: x => fireEvent.lostPointerCapture(header, {buttons: 1, clientX: x, clientY: pointer.y, pointerId: 1}),
    carriedOn: ({x = 0, y = 0}) => moveTo({x: pointer.x + x, y: pointer.y + y}),
    dropped: () => fireEvent.pointerUp(header, {pointerId: 1})
  };
};

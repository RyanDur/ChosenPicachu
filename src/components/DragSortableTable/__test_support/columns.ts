import {fireEvent} from '@testing-library/react';

export type ColumnInHand = {
  readonly carriedTo: (x: number) => void;
  readonly dropped: () => void;
};

const HEADER_Y = 20;

const emptyHanded = (): never => {
  throw new Error('no column is in hand');
};

export const noColumnInHand: ColumnInHand = {carriedTo: emptyHanded, dropped: emptyHanded};

export const liftedColumn = (header: Element, x: number): ColumnInHand => {
  const pointer = {x, y: HEADER_Y};
  const moveTo = (next: {x: number; y: number}): void => {
    pointer.x = next.x;
    pointer.y = next.y;
    fireEvent.pointerMove(header, {buttons: 1, clientX: pointer.x, clientY: pointer.y, pointerId: 1});
  };
  fireEvent.pointerDown(header, {clientX: pointer.x, clientY: pointer.y, pointerId: 1});
  return {
    carriedTo: next => moveTo({x: next, y: pointer.y}),
    dropped: () => fireEvent.pointerUp(header, {pointerId: 1})
  };
};

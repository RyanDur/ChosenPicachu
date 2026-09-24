import {fireEvent} from '@testing-library/react';

export type ColumnInHand = {
  readonly carriedTo: (x: number) => void;
  readonly carriedOn: (by: {x?: number; y?: number}) => void;
  readonly dropped: () => void;
};

const HEADER_Y = 20;

// presses the header where the spec says and hands back the drag, which keeps the pointer where it last moved
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
    carriedOn: ({x = 0, y = 0}) => moveTo({x: pointer.x + x, y: pointer.y + y}),
    dropped: () => fireEvent.pointerUp(header, {pointerId: 1})
  };
};

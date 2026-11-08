import {DragEvent} from 'react';

const crossed = (event: DragEvent<HTMLElement>, homeward: boolean): boolean => {
  const space = event.currentTarget.getBoundingClientRect();
  const quarter = space.width / 4;
  return homeward
    ? event.clientX < space.right - quarter
    : event.clientX > space.left + quarter;
};

const strayed = (clientY: number, anchor: number, strayDistance: number, upward: boolean): boolean =>
  upward
    ? clientY < anchor - strayDistance
    : clientY > anchor + strayDistance;

const strayedTo = (clientY: number, anchor: number, strayDistance: number, at: number): number =>
  strayed(clientY, anchor, strayDistance, false) ? at + 1
    : strayed(clientY, anchor, strayDistance, true) ? at - 1
      : at;

type Crossing = {
  crossed: (event: DragEvent<HTMLElement>, homeward: boolean) => boolean;
  strayedTo: (clientY: number, anchor: number, strayDistance: number, at: number) => number;
};

export const crossing: Crossing = {crossed, strayedTo};

import {DragEvent} from 'react';

export const crossed = (event: DragEvent<HTMLElement>, homeward: boolean): boolean => {
  const space = event.currentTarget.getBoundingClientRect();
  const quarter = space.width / 4;
  return homeward
    ? event.clientX < space.right - quarter
    : event.clientX > space.left + quarter;
};

export const strayed = (clientY: number, anchor: number, third: number, upward: boolean): boolean =>
  upward
    ? clientY < anchor - third
    : clientY > anchor + third;

export const strayedTo = (clientY: number, anchor: number, third: number, at: number): number =>
  strayed(clientY, anchor, third, false) ? at + 1
    : strayed(clientY, anchor, third, true) ? at - 1
      : at;

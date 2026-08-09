import {DragEvent} from 'react';

export const crossed = (event: DragEvent<HTMLElement>, homeward: boolean): boolean => {
  const space = event.currentTarget.getBoundingClientRect();
  const quarter = space.width / 4;
  return homeward
    ? event.clientX < space.right - quarter
    : event.clientX > space.left + quarter;
};

export const crossedVertical = (event: DragEvent<HTMLElement>, homeward: boolean): boolean => {
  const space = event.currentTarget.getBoundingClientRect();
  const toehold = Math.min(space.height / 4, 48);
  return homeward
    ? event.clientY < space.bottom - toehold
    : event.clientY > space.top + toehold;
};

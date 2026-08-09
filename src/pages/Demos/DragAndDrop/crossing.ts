import {DragEvent} from 'react';

export const crossed = (event: DragEvent<HTMLElement>, homeward: boolean): boolean => {
  const space = event.currentTarget.getBoundingClientRect();
  const quarter = space.width / 4;
  return homeward
    ? event.clientX < space.right - quarter
    : event.clientX > space.left + quarter;
};

export type Carried = {
  lead: number;
  trail: number;
};

export const covering = (event: DragEvent<HTMLElement>, carried: Carried, above: boolean): boolean => {
  const space = event.currentTarget.getBoundingClientRect();
  const third = space.height / 3;
  return above
    ? space.bottom - (event.clientY - carried.lead) >= third
    : (event.clientY + carried.trail) - space.top >= third;
};

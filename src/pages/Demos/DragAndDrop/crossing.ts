import {DragEvent} from 'react';

export const crossed = (event: DragEvent<HTMLElement>, homeward: boolean): boolean => {
  const space = event.currentTarget.getBoundingClientRect();
  const quarter = space.width / 4;
  return homeward
    ? event.clientX < space.right - quarter
    : event.clientX > space.left + quarter;
};

export const passedThird = (event: DragEvent<HTMLElement>, hidden: DOMRect, above: boolean): boolean =>
  above
    ? event.clientY < hidden.top + hidden.height / 3
    : event.clientY > hidden.bottom - hidden.height / 3;

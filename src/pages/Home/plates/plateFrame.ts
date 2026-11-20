import {thePage} from './thePage';

const rim = 4;

export const plateFrame = {
  x: -rim,
  y: -rim,
  width: thePage.plate.across + 2 * rim,
  height: thePage.plate.down + 2 * rim
};

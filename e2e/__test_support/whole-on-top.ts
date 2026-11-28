import type {Locator} from '@playwright/test';

const insideAnyCornerUpTo34pxRound = 10;

export const wholeOnTop = (locator: Locator): Promise<boolean> => locator.evaluate((element, inset) => {
  const {left, top, right, bottom} = element.getBoundingClientRect();
  const points = [
    [left + inset, top + inset], [right - inset, top + inset],
    [left + inset, bottom - inset], [right - inset, bottom - inset],
    [(left + right) / 2, (top + bottom) / 2]
  ];
  return points.every(([x, y]) => element.contains(document.elementFromPoint(x, y)));
}, insideAnyCornerUpTo34pxRound);

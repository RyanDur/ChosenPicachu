import type {Locator} from '@playwright/test';

export const wholeOnTop = (locator: Locator): Promise<boolean> => locator.evaluate(element => {
  const {left, top, right, bottom} = element.getBoundingClientRect();
  const inset = Math.max(2, parseFloat(getComputedStyle(element).borderTopLeftRadius));
  const points = [
    [left + inset, top + inset], [right - inset, top + inset],
    [left + inset, bottom - inset], [right - inset, bottom - inset],
    [(left + right) / 2, (top + bottom) / 2]
  ];
  return points.every(([x, y]) => element.contains(document.elementFromPoint(x, y)));
});

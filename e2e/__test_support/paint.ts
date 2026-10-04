import type {Locator, Page} from '@playwright/test';
import {decodedShot} from './shots';

// a painted page has no see-through pixel, so any in a shot of it is a part the browser left unpainted
export const unpaintedPixels = async (page: Page, part: Locator): Promise<number> => {
  const box = await part.boundingBox();
  if (box === null) throw new Error('nothing to shoot');
  const {rgba} = await decodedShot(page, await page.screenshot({clip: box, scale: 'css'}));
  return rgba.filter((value, at) => at % 4 === 3 && value === 0).length;
};

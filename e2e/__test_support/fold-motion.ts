import type {Locator, Page} from '@playwright/test';
import {decodedShot} from './shots';

// press a fold's bar and read the fold's height every frame for 450ms; a slide passes through heights between, a snap doesn't
export const heightsBetween = async (fold: Locator, bar: Locator): Promise<number> => {
  const reading = await fold.evaluateHandle(details => ({heights: new Promise<number[]>(resolve => {
    const heights: number[] = [];
    const start = performance.now();
    const read = (): void => {
      heights.push(Math.round(details.getBoundingClientRect().height));
      if (performance.now() - start < 450) requestAnimationFrame(read);
      else resolve(heights);
    };
    requestAnimationFrame(read);
  })}));
  await bar.click();
  const heights = await reading.evaluate(({heights: read}) => read);
  const [low, high] = [Math.min(...heights), Math.max(...heights)];
  return new Set(heights.filter(height => height > low && height < high)).size;
};

// the pixels in the 3px left of a control that change when the keyboard tabs onto it: the ring's left side, if it isn't clipped;
// a Tab, not focus(), since Firefox draws the ring only for focus that came from the keyboard
export const ringPixelsLeftOf = async (page: Page, control: Locator): Promise<number> => {
  await control.scrollIntoViewIfNeeded();
  const box = await control.boundingBox();
  if (box === null) throw new Error('the control is not shown');
  const strip = {x: box.x - 3, y: box.y - 3, width: 3, height: box.height + 6};
  const before = await decodedShot(page, await page.screenshot({clip: strip, scale: 'css'}));
  await control.focus();
  await page.keyboard.press('Shift+Tab');
  await page.keyboard.press('Tab');
  const after = await decodedShot(page, await page.screenshot({clip: strip, scale: 'css'}));
  const pixels = Math.min(before.rgba.length, after.rgba.length) / 4;
  const shift = (at: number): number => [0, 1, 2].reduce((sum, channel) =>
    sum + Math.abs(before.rgba[at * 4 + channel] - after.rgba[at * 4 + channel]), 0);
  return Array.from({length: pixels}, (_, at) => shift(at)).filter(change => change > 60).length;
};

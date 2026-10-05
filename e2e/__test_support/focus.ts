import type {Locator, Page} from '@playwright/test';
import {pressTab} from './keyboard';
import {decodedShot, type Pixels} from './shots';

const margin = 4;

type Box = {x: number; y: number; width: number; height: number};

const around = async (marked: readonly Locator[]): Promise<Box> => {
  const boxes = (await Promise.all(marked.map(part => part.boundingBox()))).flatMap(box => box === null ? [] : [box]);
  if (boxes.length === 0) throw new Error('the control is not shown');
  const [left, top] = [Math.min(...boxes.map(({x}) => x)), Math.min(...boxes.map(({y}) => y))];
  const [right, bottom] = [Math.max(...boxes.map(({x, width}) => x + width)), Math.max(...boxes.map(({y, height}) => y + height))];
  return {x: left, y: top, width: right - left, height: bottom - top};
};

const shot = async (page: Page, marked: readonly Locator[]): Promise<Pixels> => {
  const box = await around(marked);
  const clip = {x: box.x - margin, y: box.y - margin, width: box.width + 2 * margin, height: box.height + 2 * margin};
  return decodedShot(page, await page.screenshot({clip, scale: 'css', animations: 'disabled'}));
};

const linear = (channel: number): number => {
  const value = channel / 255;
  return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
};

const luminance = ({rgba}: Pixels, at: number): number =>
  0.2126 * linear(rgba[at * 4]) + 0.7152 * linear(rgba[at * 4 + 1]) + 0.0722 * linear(rgba[at * 4 + 2]);

const contrast = (was: Pixels, now: Pixels, at: number): number => {
  const [lighter, darker] = [luminance(was, at), luminance(now, at)].sort((a, b) => b - a);
  return (lighter + 0.05) / (darker + 0.05);
};

// a focus indicator counts where the focused pixel differs from the unfocused one by 3:1 or more; it must cover a ring
// one pixel round the control at least
export const focusStandsOut = async (page: Page, control: Locator, marked: readonly Locator[] = [control]): Promise<{changed: number; ring: number}> => {
  await control.scrollIntoViewIfNeeded();
  await page.mouse.move(0, 0);
  const before = await shot(page, marked);
  await page.keyboard.press('Shift');
  await control.focus();
  const after = await shot(page, marked);
  const box = await around(marked);
  const ring = 2 * (box.width + box.height);
  const pixels = Math.min(before.rgba.length, after.rgba.length) / 4;
  const changed = Array.from({length: pixels}, (_, at) => contrast(before, after, at)).filter(ratio => ratio >= 3).length;
  return {changed, ring};
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
  await pressTab(page, {backwards: true});
  await pressTab(page);
  const after = await decodedShot(page, await page.screenshot({clip: strip, scale: 'css'}));
  const pixels = Math.min(before.rgba.length, after.rgba.length) / 4;
  const shift = (at: number): number => [0, 1, 2].reduce((sum, channel) =>
    sum + Math.abs(before.rgba[at * 4 + channel] - after.rgba[at * 4 + channel]), 0);
  return Array.from({length: pixels}, (_, at) => shift(at)).filter(change => change > 60).length;
};

import type {Locator, Page} from '@playwright/test';
import {boxOf} from './box';

export const documentScrollY = (page: Page): Promise<number> => page.evaluate(() => window.scrollY);

export const clickWhereItIs = async (page: Page, target: Locator): Promise<void> => {
  const box = await boxOf(target, 'nothing on screen to click');
  await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
};

export const twoFramesLater = (page: Page): Promise<unknown> =>
  page.evaluate(() => new Promise(drawn => requestAnimationFrame(() => requestAnimationFrame(drawn))));

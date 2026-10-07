import type {Locator, Page} from '@playwright/test';

const fingerReach = 44;

export const fingertipMiss = fingerReach / 2 - 2;

export const fingerTap = async (page: Page, aimedAt: Locator): Promise<void> => {
  await aimedAt.scrollIntoViewIfNeeded();
  const box = await aimedAt.boundingBox();
  if (box === null) throw new Error('nothing to aim at');
  await page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2 + fingertipMiss);
};

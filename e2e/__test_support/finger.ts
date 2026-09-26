import type {Locator, Page} from '@playwright/test';

const fingertipMiss = 18;

export const fingerTap = async (page: Page, aimedAt: Locator, miss = fingertipMiss): Promise<void> => {
  await aimedAt.scrollIntoViewIfNeeded();
  const box = await aimedAt.boundingBox();
  if (box === null) throw new Error('nothing to aim at');
  await page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2 + miss);
};

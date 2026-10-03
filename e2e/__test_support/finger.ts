import type {Locator, Page} from '@playwright/test';

// a 44px target reaches 22px from its middle, so a finger landing 21px off still lands on it, and misses anything smaller
export const fingertipMiss = 21;

export const fingerTap = async (page: Page, aimedAt: Locator): Promise<void> => {
  await aimedAt.scrollIntoViewIfNeeded();
  const box = await aimedAt.boundingBox();
  if (box === null) throw new Error('nothing to aim at');
  await page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2 + fingertipMiss);
};

export const shortOfAFinger = async (controls: Locator[]): Promise<number[]> =>
  (await Promise.all(controls.map(async control => Math.round((await control.boundingBox())?.height ?? 0)))).filter(height => height < 44);

import {not} from '@ryandur/sand';
import type {Locator, Page} from '@playwright/test';
import {assertionPatience} from './patience';

const fingerReach = 44;

export const fingertipMiss = fingerReach / 2 - 2;

type Box = {x: number; y: number; width: number; height: number};

const scrolledToTheMiddle = (aimedAt: Locator): Promise<Box> => aimedAt.evaluate(target => new Promise<Box>(settled => {
  target.scrollIntoView({block: 'center'});
  // Chromium moves an anchored box to its scrolled place only when it next renders a frame.
  requestAnimationFrame(() => requestAnimationFrame(() => {
    const {x, y, width, height} = target.getBoundingClientRect();
    settled({x, y, width, height});
  }));
}));

export const fingerTap = async (page: Page, aimedAt: Locator): Promise<void> => {
  await aimedAt.click({trial: true});
  const box = await scrolledToTheMiddle(aimedAt);
  await page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2 + fingertipMiss);
};

const opensWithinAMoment = async (page: Page, fold: Locator): Promise<boolean> =>
  page.waitForFunction(details => details?.hasAttribute('open') ?? false, await fold.elementHandle(), {timeout: assertionPatience})
    .then(() => true, () => false);

export const foldsAFingerLeavesShut = async (page: Page, folds: Locator[]): Promise<string[]> => {
  const shut: string[] = [];
  for (const fold of folds) {
    const bar = fold.getByText(/\S/).first();
    await fingerTap(page, bar);
    if (not(await opensWithinAMoment(page, fold))) {
      shut.push(await bar.textContent() ?? '');
    }
  }
  return shut;
};

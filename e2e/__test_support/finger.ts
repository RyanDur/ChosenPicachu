import type {Locator, Page} from '@playwright/test';

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

const aMomentToOpen = 2000;

const opensWithinAMoment = (fold: Locator): Promise<boolean> => fold.evaluate((details, moment) => new Promise<boolean>(answered => {
  if (details.hasAttribute('open')) {
    answered(true);
    return;
  }
  const watch = new MutationObserver(() => {
    watch.disconnect();
    answered(details.hasAttribute('open'));
  });
  watch.observe(details, {attributes: true, attributeFilter: ['open']});
  setTimeout(() => {
    watch.disconnect();
    answered(details.hasAttribute('open'));
  }, moment);
}), aMomentToOpen);

export const foldsAFingerLeavesShut = async (page: Page, folds: Locator[]): Promise<string[]> => {
  const shut: string[] = [];
  for (const fold of folds) {
    const bar = fold.getByText(/\S/).first();
    await fingerTap(page, bar);
    if (!await opensWithinAMoment(fold)) {
      shut.push(await bar.textContent() ?? '');
    }
  }
  return shut;
};

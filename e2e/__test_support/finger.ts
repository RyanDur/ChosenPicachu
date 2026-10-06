import type {Locator, Page} from '@playwright/test';

const fingerReach = 44;

export const fingertipMiss = fingerReach / 2 - 1;

export const fingerTap = async (page: Page, aimedAt: Locator): Promise<void> => {
  await aimedAt.scrollIntoViewIfNeeded();
  const box = await aimedAt.boundingBox();
  if (box === null) throw new Error('nothing to aim at');
  await page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2 + fingertipMiss);
};

export const shortOfAFinger = async (controls: Locator[]): Promise<string[]> => {
  const measured = await Promise.all(controls.map(async control => ({
    name: (await control.textContent())?.trim() ?? '',
    height: Math.round((await control.boundingBox())?.height ?? 0)
  })));
  return measured.filter(({height}) => height < fingerReach).map(({name, height}) => `${name}: ${height}px`);
};

export const foldBarsShortOfAFinger = async (folds: Locator[]): Promise<string[]> => {
  const measured = await Promise.all(folds.map(fold => fold.evaluate(details => {
    const bar = details instanceof HTMLDetailsElement ? details.querySelector(':scope > summary') : null;
    return {name: bar?.textContent.trim() ?? 'a fold with no bar', open: details instanceof HTMLDetailsElement && details.open, height: Math.round(bar?.getBoundingClientRect().height ?? 0)};
  })));
  return measured.flatMap(({name, open, height}) => {
    if (open) return [`${name}: open`];
    return height < fingerReach ? [`${name}: ${height}px`] : [];
  });
};

import {expect, test} from '@playwright/test';

// the jsdom laws dispatch events by target; only a real input pipeline exercises
// hit-testing and pointer capture, which is where the frame's drags have broken before
test('a real drag reorders the frame columns in the default world', async ({page}) => {
  await page.goto('/ChosenPicachu/demos/?tab=tables&world=html');
  const frame = page.frameLocator('iframe.table-frame');
  const trades = frame.locator('th.trades');
  await expect(trades).toBeVisible();

  const order = () => frame.locator('thead th').evaluateAll(headers =>
    headers.map(header => header.className.split(' ')[1]));

  const from = await trades.boundingBox();
  const to = await frame.locator('th.sells').boundingBox();
  if (!from || !to) {
    throw new Error('the headers never stood');
  }

  const start = {x: from.x + from.width / 2, y: from.y + from.height / 2};
  await page.mouse.move(start.x, start.y);
  await page.mouse.down();
  const target = to.x + to.width * 0.8;
  for (let step = 1; step <= 12; step++) {
    await page.mouse.move(start.x + (target - start.x) * (step / 12), start.y);
  }
  await page.mouse.up();

  expect(await order()).toEqual(['window', 'buys', 'sells', 'trades', 'volume', 'vwap', 'change']);
});

test('a menu choice sorts, and never lifts the column', async ({page}) => {
  await page.goto('/ChosenPicachu/demos/?tab=tables&world=html');
  const frame = page.frameLocator('iframe.table-frame');
  await frame.locator('th.trades').waitFor();

  await frame.locator('th.trades .menu-toggle').click();
  await frame.locator('#sort-trades button.item', {hasText: 'descending'}).click();

  await expect(frame.locator('th.trades')).toHaveAttribute('aria-sort', 'descending');
  await expect(frame.locator('th.trades .menu-toggle')).toHaveText('▼');
  await expect(frame.locator('table.column-ghost')).toHaveCount(0);
  await expect(frame.locator('article.drag-surface')).toHaveCount(0);
  await expect(frame.locator('th.trades')).not.toHaveClass(/hide/);
});

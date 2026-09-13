import {expect, test} from '@playwright/test';

// the jsdom laws dispatch events by target; only a real input pipeline exercises
// hit-testing and pointer capture, which is where the frame's drags have broken before
test('a real drag reorders the frame columns in the default world', async ({page}) => {
  await page.goto('/ChosenPicachu/demos/?tab=tables&world=vanilla');
  const frame = page.frameLocator('iframe[title="the living table, in vanilla"]');
  const trades = frame.getByRole('columnheader', {name: 'trades'});
  await expect(trades).toBeVisible();

  const order = () => frame.getByRole('columnheader').evaluateAll(headers =>
    headers.map(header => header.getAttribute('aria-label')));

  const from = await trades.boundingBox();
  const to = await frame.getByRole('columnheader', {name: 'sells'}).boundingBox();
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

  await expect.poll(order).toEqual(['window', 'buys', 'sells', 'trades', 'volume', 'vwap', 'change']);
});

test('a menu choice sorts, and never lifts the column', async ({page}) => {
  await page.goto('/ChosenPicachu/demos/?tab=tables&world=vanilla');
  const frame = page.frameLocator('iframe[title="the living table, in vanilla"]');
  const trades = frame.getByRole('columnheader', {name: 'trades'});
  await expect(trades).toBeVisible();

  await frame.getByRole('button', {name: 'sort trades'}).click();
  await frame.getByRole('button', {name: 'descending'}).click();

  await expect(trades).toHaveAttribute('aria-sort', 'descending');
  await expect(trades).not.toHaveClass(/carried/);
});

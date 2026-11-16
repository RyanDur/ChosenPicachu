import {expect} from '@playwright/test';
import {test} from './__test_support/journey';
import {pillSwitch, tableWorlds} from './__test_support';

test('in the vanilla world, the live table arrives in the card’s own frame and the card holds no second table', async ({page}) => {
  const tables = tableWorlds.card(page);
  await page.goto('demos/tables/?world=vanilla');

  await expect(tables.vanillaTable).toBeVisible();
  await expect(tables.ownTables).toHaveCount(0);
});

test('the world dial swaps the stage, from the react table to the vanilla frame in the card', async ({page}) => {
  const tables = tableWorlds.card(page);
  await page.goto('demos/tables/');
  await expect(tables.ownTables).toBeVisible();

  await pillSwitch(page, 'world').choose('Vanilla');

  await expect(tables.vanillaTable).toBeVisible();
  await expect(tables.ownTables).toHaveCount(0);
});

test('the vanilla table reads to a screen reader as the react table does: its caption, its headers on both axes and no stray image', async ({page}) => {
  const [react, vanilla] = tableWorlds.stages;
  const reactTable = await tableWorlds.opened(page, react);
  const told = await reactTable.reading();
  const vanillaTable = await tableWorlds.opened(page, vanilla);

  expect(await vanillaTable.reading()).toEqual(told);
  expect(told).toContain('- table "Live totals by lookback":');
  expect(told.filter(line => line.startsWith('- img'))).toEqual([]);
});

test('the Tables tab says the table could not be assembled when its script never arrives', async ({page}) => {
  await page.route('**/assets/assemble-*.js', route => route.abort());

  await page.goto('demos/tables/?world=vanilla');

  await expect(page.getByRole('alert')).toContainText('the table could not be assembled');
});

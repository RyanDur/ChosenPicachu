import {expect} from '@playwright/test';
import {test} from './__test_support/journey';
import {pillSwitch, tablesFrame} from './__test_support';

test('in the vanilla world, the live table arrives in the card’s own frame and the card holds no second table', async ({page}) => {
  const tables = tablesFrame.card(page);
  await page.goto('demos/tables/?world=vanilla');

  await expect(tables.vanillaTable).toBeVisible();
  await expect(tables.ownTables).toHaveCount(0);
});

test('the world dial swaps the stage, from the react table to the vanilla frame in the card', async ({page}) => {
  const tables = tablesFrame.card(page);
  await page.goto('demos/tables/');
  await expect(tables.ownTables).toBeVisible();

  await pillSwitch(page, 'world').choose('Vanilla');

  await expect(tables.vanillaTable).toBeVisible();
  await expect(tables.ownTables).toHaveCount(0);
});

test('the vanilla table reads to a screen reader as the react table does: its caption, its headers on both axes and no stray image', async ({page}) => {
  const [react, vanilla] = tablesFrame.stages;
  await page.goto(react.at);
  await expect(tablesFrame.card(page).ownTables).toBeVisible();
  const told = await tablesFrame.dragSortTable(page, react.holder(page)).reading();
  await page.goto(vanilla.at);
  await expect(tablesFrame.card(page).vanillaTable).toBeVisible();

  expect(await tablesFrame.dragSortTable(page, vanilla.holder(page)).reading()).toEqual(told);
  expect(told).toContain('- table "Live totals by lookback":');
  expect(told.filter(line => line.startsWith('- img'))).toEqual([]);
});

test('the Tables tab says the table could not be assembled when its script never arrives', async ({page}) => {
  await page.route('**/assets/assemble-*.js', route => route.abort());

  await page.goto('demos/tables/?world=vanilla');

  await expect(page.getByRole('alert')).toContainText('the table could not be assembled');
});

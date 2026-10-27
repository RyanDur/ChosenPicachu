import {expect, test} from '@playwright/test';
import {dragSortTable, pillSwitch, stages, tablesCard} from './__test_support';

test('in the vanilla world, the live table arrives in the card’s own frame and the card holds no second table', async ({page}) => {
  const tables = tablesCard(page);
  await page.goto('demos/tables/?world=vanilla');

  await expect(tables.vanillaTable).toBeVisible();
  await expect(tables.ownTables).toHaveCount(0);
});

test('the world dial swaps the stage, from the react table to the vanilla frame in the card', async ({page}) => {
  const tables = tablesCard(page);
  await page.goto('demos/tables/');
  await expect(tables.ownTables).toBeVisible();

  await pillSwitch(page, 'world').choose('Vanilla');

  await expect(tables.vanillaTable).toBeVisible();
  await expect(tables.ownTables).toHaveCount(0);
});

test('the vanilla table reads to a screen reader as the react table does: its caption, its headers on both axes and no stray image', async ({page}) => {
  const [react, vanilla] = stages;
  await page.goto(react.at);
  await expect(tablesCard(page).ownTables).toBeVisible();
  const told = await dragSortTable(page, react.table(page)).reading();
  await page.goto(vanilla.at);
  await expect(tablesCard(page).vanillaTable).toBeVisible();

  expect(await dragSortTable(page, vanilla.table(page)).reading()).toEqual(told);
  expect(told).toContain('- table "Live aggregations by window":');
  expect(told.filter(line => line.startsWith('- img'))).toEqual([]);
});

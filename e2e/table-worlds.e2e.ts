import {expect, test} from '@playwright/test';
import {pillSwitch, tablesCard} from './__test_support';

test('in the vanilla world, the live table arrives in the card’s own frame and the card holds no second table', async ({page}) => {
  const tables = tablesCard(page);
  await page.goto('demos/?tab=tables&world=vanilla');

  await expect(tables.vanillaTable).toBeVisible();
  await expect(tables.ownTables).toHaveCount(0);
});

test('the world dial swaps the stage, from the react table to the vanilla frame in the card', async ({page}) => {
  const tables = tablesCard(page);
  await page.goto('demos/?tab=tables');
  await expect(tables.ownTables).toBeVisible();

  await pillSwitch(page, 'world').choose('Vanilla');

  await expect(tables.vanillaTable).toBeVisible();
  await expect(tables.ownTables).toHaveCount(0);
});

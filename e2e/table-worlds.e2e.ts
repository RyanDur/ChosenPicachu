import {Page, expect, test} from '@playwright/test';
import {pillSwitch} from './__test_support';

const card = (page: Page) => page.getByRole('region', {name: 'live aggregations'});
const vanillaTable = (page: Page) => page.getByTitle('the living table, in vanilla').contentFrame().getByRole('table');

test('in the vanilla world, the live table arrives in its own frame and the card holds no second table', async ({page}) => {
  await page.goto('demos/?tab=tables&world=vanilla');

  await expect(vanillaTable(page)).toBeVisible();
  await expect(card(page).getByRole('table')).toHaveCount(0);
});

test('the world dial swaps the stage, from the react table to the vanilla frame', async ({page}) => {
  await page.goto('demos/?tab=tables');
  await expect(card(page).getByRole('table')).toBeVisible();

  await pillSwitch(page, 'world').choose('Vanilla');

  await expect(vanillaTable(page)).toBeVisible();
  await expect(card(page).getByRole('table')).toHaveCount(0);
});

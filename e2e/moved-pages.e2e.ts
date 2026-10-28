import {expect, test} from '@playwright/test';
import {siteFrame} from './__test_support';

test('a link saved to the old Development address lands on its Practice tab, and Back returns to where it was followed from', async ({page}) => {
  await page.goto('');
  await expect(page.getByRole('heading', {level: 1, name: 'The three languages'})).toBeVisible();

  await page.goto('development/?tab=presentation');

  await expect(page.getByRole('heading', {level: 1, name: 'Practice Presentation'})).toBeVisible();
  await expect(page).toHaveURL(/\/practice\/presentation\/$/);

  await page.goBack();

  await expect(page.getByRole('heading', {level: 1, name: 'The three languages'})).toBeVisible();
});

test('a link saved to an old demos tab lands on that tab\'s own address, its dials kept', async ({page}) => {
  await page.goto('demos/?tab=tables&world=vanilla');

  await expect(page.getByRole('heading', {level: 1, name: 'Demos Tables'})).toBeVisible();
  await expect(page).toHaveURL(/\/demos\/tables\/\?world=vanilla$/);
  await expect(page.getByTitle('the living table, in vanilla')).toBeAttached();
});

test.describe('a reader with script off', () => {
  test.use({javaScriptEnabled: false});

  for (const {from, to, title} of [
    {from: 'demos/', to: /\/demos\/accordions\/$/, title: 'Demos Accordions'},
    {from: 'practice/', to: /\/practice\/structure\/$/, title: 'Practice Structure'},
    {from: 'development/', to: /\/practice\/structure\/$/, title: 'Practice Structure'}
  ]) {
    test(`at /${from} lands on its first tab`, async ({page}) => {
      await page.goto(from);

      await expect(page).toHaveURL(to);
      await expect(siteFrame(page).title).toHaveText(title);
    });
  }
});

test('an address with no page answers that it is not found, and says there is no such room', async ({page}) => {
  const answer = await page.goto('nowhere/');

  expect(answer?.status()).toBe(404);
  await expect(siteFrame(page).title).toHaveText('No such room');
});

test('the old address of the game that was never built answers that it is not found', async ({page}) => {
  const answer = await page.goto('games/colorGame');

  expect(answer?.status()).toBe(404);
  await expect(siteFrame(page).title).toHaveText('No such room');
});

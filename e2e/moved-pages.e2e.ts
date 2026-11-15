import {expect} from '@playwright/test';
import {test} from './__test_support/journey';
import {siteFrame, tablesDemo} from './__test_support';

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

test('a link saved to an old tables tutorial address lands on that tutorial, and Back returns to where it was followed from', async ({page}) => {
  await page.goto('');
  await expect(page.getByRole('heading', {level: 1, name: 'The three languages'})).toBeVisible();

  await page.goto('demos/tables/?tut=menu&world=vanilla');

  await expect(tablesDemo(page).tutorials.title('Sort menu')).toBeVisible();
  await expect(page).toHaveURL(/\/demos\/tables\/menu\/\?world=vanilla$/);

  await page.goBack();

  await expect(page.getByRole('heading', {level: 1, name: 'The three languages'})).toBeVisible();
});

test.describe('a reader with script turned off', () => {
  test.use({javaScriptEnabled: false});

  test('follows a link saved to an old tables tutorial address to the tables tab and its list of tutorials', async ({page}) => {
    const {tutorials} = tablesDemo(page);

    await page.goto('demos/tables/?tut=menu');

    await expect(tutorials.link('Sort menu')).toBeVisible();
    await expect(tutorials.title('Sort menu')).toHaveCount(0);
  });
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

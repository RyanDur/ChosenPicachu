import {expect} from '@playwright/test';
import {test} from './__test_support/journey';
import {chartsPage, siteFrame} from './__test_support';

test('a desk reader follows Candles from the parts beside the opening to the Candles page', {tag: '@desktop'}, async ({page}) => {
  await page.goto('demos/charts/');
  await siteFrame(page).hydrated();

  await chartsPage(page).partLink('Candles').click();

  await expect(page).toHaveURL(/demos\/charts\/candles\/$/);
  await expect(page.getByRole('article', {name: 'Candles tutorial'})).toBeVisible();
});

test('a desk reader follows Pressure from the panel beside the Candles page to the Pressure page', {tag: '@desktop'}, async ({page}) => {
  await page.goto('demos/charts/candles/');
  await siteFrame(page).hydrated();

  await chartsPage(page).partLink('Pressure').click();

  await expect(page).toHaveURL(/demos\/charts\/pressure\/$/);
  await expect(page.getByRole('article', {name: 'Pressure tutorial'})).toBeVisible();
});

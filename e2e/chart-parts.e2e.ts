import {expect} from '@playwright/test';
import {test} from './__test_support/journey';
import {chartsPage, siteFrame} from './__test_support';

test('a desk reader follows Pressure from the panel beside the Candles page to the Pressure page', {tag: '@desktop'}, async ({page}) => {
  await page.goto('demos/charts/candles/');
  await siteFrame(page).hydrated();

  await chartsPage(page).partLink('Pressure').click();

  await expect(page).toHaveURL(/demos\/charts\/pressure\/$/);
  await expect(page.getByRole('article', {name: 'Pressure tutorial'})).toBeVisible();
});

test('a desk reader goes from the Candles page to the Tables tab by its tab', {tag: '@desktop'}, async ({page}) => {
  await page.goto('demos/charts/candles/');
  await siteFrame(page).hydrated();

  await page.getByRole('navigation', {name: 'demos'}).getByRole('link', {name: 'Tables', exact: true}).click();

  await expect(page).toHaveURL(/demos\/tables\/$/);
  await expect(page.getByRole('heading', {name: 'Demos Tables', level: 1})).toBeVisible();
});

import {expect} from '@playwright/test';
import {test} from './__test_support/journey';
import {bannerAtTheEdge} from './__test_support';

const address = 'demos/z-index/why-a-fixed-banner-still-loses/';

test('moving the banner to the page’s level keeps the step in the address', async ({page}) => {
  const banner = bannerAtTheEdge(page);
  await page.goto(address);

  await banner.stepsTo('2 · Moved to the page');

  await expect(page).toHaveURL(/why-a-fixed-banner-still-loses\/\?banner=moved-to-the-page$/);
});

test('Tab reaches the banner’s dismiss button between Raise a banner and Open while the banner is written in card one', async ({page}) => {
  const banner = bannerAtTheEdge(page);

  await page.goto(address);

  expect(await banner.tabStopsInTheLittlePage()).toEqual(['Raise a banner', 'Dismiss the banner', 'Open']);
});

test('Tab reaches the banner’s dismiss button last once the banner is moved to the page', async ({page}) => {
  const banner = bannerAtTheEdge(page);

  await page.goto(`${address}?banner=moved-to-the-page`);

  expect(await banner.tabStopsInTheLittlePage()).toEqual(['Raise a banner', 'Open', 'Dismiss the banner']);
});

test('where card two meets the banner written in card one, card two is drawn over the banner', async ({page}) => {
  const banner = bannerAtTheEdge(page);

  await page.goto(address);

  await expect.poll(banner.onTopWhereCardTwoMeetsTheBanner).toBe('card two');
});

test('where card two meets the banner moved to the page, the banner is drawn over card two', async ({page}) => {
  const banner = bannerAtTheEdge(page);

  await page.goto(`${address}?banner=moved-to-the-page`);

  await expect.poll(banner.onTopWhereCardTwoMeetsTheBanner).toBe('the banner');
});

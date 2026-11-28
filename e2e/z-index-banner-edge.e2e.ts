import {expect} from '@playwright/test';
import {test} from './__test_support/journey';
import {bannerAtTheEdge} from './__test_support';

const address = 'demos/z-index/why-a-fixed-banner-still-loses/';

test('moving the banner to the page’s level keeps the step in the address and says what the browser drew', async ({page}) => {
  const banner = bannerAtTheEdge(page);
  await page.goto(address);

  await banner.stepsTo('2 · Moved to the page');

  await expect(page).toHaveURL(/why-a-fixed-banner-still-loses\/\?banner=moved-to-the-page$/);
  await expect(banner.verdict)
    .toHaveText('The banner is drawn over card two, and its dismiss button is now the last stop for the Tab key.');
});

test('a copied address opens the banner exhibit on the step it names', async ({page}) => {
  const banner = bannerAtTheEdge(page);

  await page.goto(`${address}?banner=moved-to-the-page`);

  await expect(banner.step('2 · Moved to the page')).toBeChecked();
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

test('scrolling card two to the banner written in card one draws card two over the banner', async ({page}) => {
  const banner = bannerAtTheEdge(page);

  await page.goto(address);

  await expect.poll(banner.onTopOnceCardTwoScrollsToTheBanner).toBe('card two');
});

test('scrolling card two to the banner moved to the page draws the banner over card two', async ({page}) => {
  const banner = bannerAtTheEdge(page);

  await page.goto(`${address}?banner=moved-to-the-page`);

  await expect.poll(banner.onTopOnceCardTwoScrollsToTheBanner).toBe('the banner');
});

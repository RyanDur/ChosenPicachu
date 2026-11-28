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

test('a bigger number arriving keeps the step in the address', async ({page}) => {
  const banner = bannerAtTheEdge(page);
  await page.goto(`${address}?banner=moved-to-the-page`);

  await banner.stepsTo('3 · A bigger number arrives');

  await expect(page).toHaveURL(/why-a-fixed-banner-still-loses\/\?banner=a-bigger-number-arrives$/);
});

test('once a bigger number arrives, the help button is drawn over the end of the banner', async ({page}) => {
  const banner = bannerAtTheEdge(page);
  await page.goto(`${address}?banner=moved-to-the-page`);

  await banner.stepsTo('3 · A bigger number arrives');

  await expect.poll(banner.onTopAtTheBannersEnd).toBe('the help button');
});

test('stepping back from the bigger number draws the banner whole again', async ({page}) => {
  const banner = bannerAtTheEdge(page);
  await page.goto(`${address}?banner=a-bigger-number-arrives`);
  await expect.poll(banner.onTopAtTheBannersEnd).toBe('the help button');

  await banner.stepsTo('2 · Moved to the page');

  await expect.poll(banner.onTopAtTheBannersEnd).toBe('the banner');
});

test('Tab reaches the help button after the banner’s dismiss button once a bigger number arrives', async ({page}) => {
  const banner = bannerAtTheEdge(page);

  await page.goto(`${address}?banner=a-bigger-number-arrives`);

  expect(await banner.tabStopsInTheLittlePage()).toEqual(['Raise a banner', 'Open', 'Dismiss the banner', 'Help · 10000']);
});

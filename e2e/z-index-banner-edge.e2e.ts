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

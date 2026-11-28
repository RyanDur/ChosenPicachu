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

test('the HTML marks the banner, written inside card one after the button that raised it', async ({page}) => {
  const banner = bannerAtTheEdge(page);

  await page.goto(address);

  await expect.poll(banner.html).toEqual([
    '<section class="little-card one">',
    '<button>Raise a banner</button>',
    '<p class="banner">… <button>×</button></p>',
    '</section>',
    '<p>text on the page</p>',
    '<section class="little-card two">',
    '<button>Open</button>',
    '</section>'
  ]);
  expect(await banner.markedHtml()).toEqual(['<p class="banner">… <button>×</button></p>']);
});

test('the HTML marks the banner, moved to the end of the page', async ({page}) => {
  const banner = bannerAtTheEdge(page);

  await page.goto(address);

  await banner.stepsTo('2 · Moved to the page');

  await expect.poll(banner.html).toEqual([
    '<section class="little-card one">',
    '<button>Raise a banner</button>',
    '</section>',
    '<p>text on the page</p>',
    '<section class="little-card two">',
    '<button>Open</button>',
    '</section>',
    '<p class="banner">… <button>×</button></p>'
  ]);
  expect(await banner.markedHtml()).toEqual(['<p class="banner">… <button>×</button></p>']);
});

test('the CSS shows the cards’ z-index of 1 and the banner’s fixed 9999, as the window draws them', async ({page}) => {
  const banner = bannerAtTheEdge(page);

  await page.goto(address);

  await expect.poll(banner.css).toEqual([
    '.little-card {', 'position: relative;', 'z-index: 1;', '}',
    '.banner {', 'position: fixed;', 'inset-inline: var(--base);', 'inset-block-end: var(--base);', 'z-index: 9999;', '}'
  ]);
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

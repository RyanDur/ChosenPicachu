import {Browser, expect, test} from '@playwright/test';
import {desktop, homePage, iPad11Upright, iPad13Upright, iPadSideways, siteFrame} from './__test_support';

const openerHeightOn = async (browser: Browser, device: {viewport: {width: number; height: number}; hasTouch: boolean}): Promise<number> => {
  const context = await browser.newContext(device);
  const page = await context.newPage();
  await page.goto('');
  const opener = homePage(page).opener;
  await expect(opener).toBeVisible();
  const box = await opener.boundingBox();
  await context.close();
  if (box === null) throw new Error('the opener has no box to measure');
  return box.height;
};

test('a 13-inch iPad held upright gets an opener no taller than an 11-inch one', async ({browser}) => {
  const onTheBigger = await openerHeightOn(browser, iPad13Upright);
  const onTheSmaller = await openerHeightOn(browser, iPad11Upright);

  expect(onTheBigger).toBeLessThanOrEqual(onTheSmaller);
});

test.describe('a 13-inch iPad held upright', () => {
  test.use(iPad13Upright);

  test('has the nav above the page, in reach without scrolling', async ({page}) => {
    const site = siteFrame(page);
    await page.goto('');

    await expect.poll(site.navAboveThePage).toBe(true);
    await expect(site.nav).toBeInViewport();
  });
});

for (const {reader, device} of [{reader: 'an iPad held sideways', device: iPadSideways}, {reader: 'a desktop', device: desktop}]) {
  test.describe(reader, () => {
    test.use(device);

    test('keeps the nav rail beside the page', async ({page}) => {
      const site = siteFrame(page);
      await page.goto('');

      await expect.poll(site.railBesideThePage).toBe(true);
    });
  });
}

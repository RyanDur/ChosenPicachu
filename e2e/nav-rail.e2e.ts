import {Browser, Page, expect, test} from '@playwright/test';
import {desktop, homePage, iPad11Upright, iPad13Upright, iPadSideways} from './__test_support';

const openerHeightOn = async (browser: Browser, device: {viewport: {width: number; height: number}; hasTouch: boolean}): Promise<number> => {
  const context = await browser.newContext(device);
  const page = await context.newPage();
  await page.goto('');
  const opener = await homePage(page).opener.boundingBox();
  await context.close();
  return opener === null ? 0 : opener.height;
};

const railBesideThePage = async (page: Page): Promise<boolean> => {
  const nav = await page.getByRole('navigation', {name: 'site'}).boundingBox();
  const main = await page.getByRole('main').boundingBox();
  return nav !== null && main !== null && nav.x + nav.width <= main.x;
};

const navAboveThePage = async (page: Page): Promise<boolean> => {
  const nav = await page.getByRole('navigation', {name: 'site'}).boundingBox();
  const main = await page.getByRole('main').boundingBox();
  return nav !== null && main !== null && nav.y + nav.height <= main.y;
};

test('a 13-inch iPad held upright gets an opener no taller than an 11-inch one', async ({browser}) => {
  const onTheBigger = await openerHeightOn(browser, iPad13Upright);
  const onTheSmaller = await openerHeightOn(browser, iPad11Upright);

  expect(onTheBigger).toBeGreaterThan(0);
  expect(onTheBigger).toBeLessThanOrEqual(onTheSmaller);
});

test.describe('a 13-inch iPad held upright', () => {
  test.use(iPad13Upright);

  test('has the nav above the page, in reach without scrolling', async ({page}) => {
    await page.goto('');

    await expect.poll(() => navAboveThePage(page)).toBe(true);
    await expect(page.getByRole('navigation', {name: 'site'})).toBeInViewport();
  });
});

for (const {reader, device} of [{reader: 'an iPad held sideways', device: iPadSideways}, {reader: 'a desktop', device: desktop}]) {
  test.describe(reader, () => {
    test.use(device);

    test('keeps the nav rail beside the page', async ({page}) => {
      await page.goto('');

      await expect.poll(() => railBesideThePage(page)).toBe(true);
    });
  });
}

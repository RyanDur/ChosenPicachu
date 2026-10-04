import {Page, expect, test} from '@playwright/test';
import {iPad11Upright, iPadUpright, justPastAPhone, siteFrame, splitViewWide} from './__test_support';

const demos = ['Accordions', 'Z-index', 'Drag sort', 'Charts', 'Tables'];

const scrolledSideways = async (page: Page): Promise<number> => page.evaluate(() => {
  window.scrollBy(300, 0);
  return window.scrollX;
});

const opensAndFits = async (page: Page, demo: string): Promise<void> => {
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.getByRole('navigation', {name: 'demos'}).getByRole('link', {name: demo}).click();
  await expect(page.getByRole('region', {name: demo, exact: true}).first()).toBeVisible();
  await expect(siteFrame(page).nav.getByRole('link').last()).toBeInViewport();

  await page.getByRole('heading').last().scrollIntoViewIfNeeded();

  expect(await scrolledSideways(page)).toBe(0);
};

for (const {reader, device} of [
  {reader: 'an iPad held upright', device: iPadUpright},
  {reader: 'an 11-inch iPad held upright', device: iPad11Upright},
  {reader: 'a split view wider than a phone', device: splitViewWide},
  {reader: 'a window just past a phone', device: justPastAPhone}
]) {
  test.describe(reader, () => {
    test.use(device);

    test('opens each demos tab in turn, and none runs past the view', async ({page}) => {
      await page.goto('demos/');

      for (const demo of demos) {
        await test.step(demo, () => opensAndFits(page, demo));
      }
    });

    test('scrolls the wide table inside its own card to its last column', async ({page}) => {
      await page.goto('demos/?tab=tables');
      const table = page.getByRole('table', {name: 'Live aggregations by window'});
      const lastColumn = table.getByRole('columnheader').last();
      await table.hover();

      await page.mouse.wheel(2000, 0);

      await expect(lastColumn).toBeInViewport({ratio: 1});
      expect(await page.evaluate(() => window.scrollX)).toBe(0);
    });
  });
}

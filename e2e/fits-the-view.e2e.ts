import {Page, expect, test} from '@playwright/test';
import {iPad11Upright, iPadUpright, justPastAPhone, siteFrame, splitViewWide} from './__test_support';

const scrolledSideways = async (page: Page): Promise<number> => page.evaluate(() => {
  window.scrollBy(300, 0);
  return window.scrollX;
});

for (const {reader, device} of [
  {reader: 'an iPad held upright', device: iPadUpright},
  {reader: 'an 11-inch iPad held upright', device: iPad11Upright},
  {reader: 'a split view wider than a phone', device: splitViewWide},
  {reader: 'a window just past a phone', device: justPastAPhone}
]) {
  test.describe(reader, () => {
    test.use(device);

    for (const tab of ['accordions', 'z-index', 'dragAndDrop', 'charts', 'tables']) {
      test(`the ${tab} demo fits the view, with the site's last link inside it`, async ({page}) => {
        await page.goto(`demos/?tab=${tab}`);
        await expect(siteFrame(page).nav.getByRole('link').last()).toBeInViewport();

        await page.getByRole('heading').last().scrollIntoViewIfNeeded();

        expect(await scrolledSideways(page)).toBe(0);
      });
    }

    test('the wide table is reached whole by a swipe inside its own card', async ({page}) => {
      await page.goto('demos/?tab=tables');
      const lastColumn = page.getByRole('table', {name: 'Live aggregations by window'}).getByRole('columnheader').last();

      await lastColumn.scrollIntoViewIfNeeded();

      await expect(lastColumn).toBeInViewport();
      expect(await page.evaluate(() => window.scrollX)).toBe(0);
    });
  });
}

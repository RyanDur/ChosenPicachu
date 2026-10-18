import {Locator, Page, expect, test} from '@playwright/test';
import {dragSortTable, stages} from './__test_support';

test.use({viewport: {width: 1280, height: 800}});

const scrolledDownTo = async (page: Page, target: Locator): Promise<void> => {
  const box = await target.boundingBox();
  if (box) await page.evaluate(top => window.scrollBy(0, top - innerHeight / 2), box.y);
};

for (const {name, at, table} of stages) {
  test(`at 1280 wide the whole table is in view, every header and grip, without scrolling it sideways, in ${name}`, async ({page}) => {
    await page.goto(at);
    const trades = dragSortTable(page, table(page));
    await expect(trades.columnHeader('trades')).toBeVisible();

    for (const header of ['window', 'trades', 'buys', 'sells', 'volume', 'vwap', 'change'].map(trades.columnHeader)) {
      await scrolledDownTo(page, header);
      await expect(header).toBeInViewport({ratio: 1});
    }
    for (const grip of [1, 2, 3, 4, 5].map(trades.rowGrip)) {
      await scrolledDownTo(page, grip);
      await expect(grip).toBeInViewport({ratio: 1});
    }
  });
}

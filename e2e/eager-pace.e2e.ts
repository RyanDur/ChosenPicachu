import {expect} from '@playwright/test';
import {test} from './__test_support/journey';
import {dragSortTable, stagesWith} from './__test_support';

for (const {name, at, table} of stagesWith('pace=eager')) {
  test.describe(`an eager table, in ${name}`, () => {
    test('a held column takes each seat it crosses before it is dropped', async ({page}) => {
      await page.goto(at);
      const trades = dragSortTable(page, table(page));
      await expect(trades.columnHeader('trades')).toBeVisible();

      const hold = await trades.holdColumn('trades');
      await hold.carryTo(trades.columnHeader('vwap'));

      await expect.poll(() => trades.columnOrder()).toEqual(['lookback', 'buys', 'sells', 'volume', 'vwap', 'trades', 'change']);
      await hold.drop();
    });

    test('a column whose button is let go outside the page lands where it was carried', async ({page, browserName}) => {
      test.skip(browserName !== 'chromium', 'only Chromium\'s DevTools protocol moves a pointer whose button was let go elsewhere');
      await page.goto(at);
      const trades = dragSortTable(page, table(page));
      await trades.listenToTheMoveReport();
      const hold = await trades.holdColumn('trades');
      await hold.carryTo(trades.columnHeader('vwap'));

      await hold.letGoOutsideThePage();

      await expect.poll(() => trades.whatTheMoveReportSaid()).toEqual(['trades moved to column 6 of 7']);
      expect(await trades.columnOrder()).toEqual(['lookback', 'buys', 'sells', 'volume', 'vwap', 'trades', 'change']);
    });

    test('a held row takes each seat it crosses before it is dropped', async ({page}) => {
      await page.goto(at);
      const trades = dragSortTable(page, table(page));
      await expect(trades.columnHeader('trades')).toBeVisible();

      const hold = await trades.holdRow(1);
      await hold.carryTo(trades.row(/last 15 minutes/));

      await expect.poll(() => trades.rowOrder()).toEqual(['last 5 minutes', 'last 15 minutes', 'this minute', 'this hour', 'session']);
      await hold.drop();
    });
  });
}

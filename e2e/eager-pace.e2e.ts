import {expect, test} from '@playwright/test';
import {dragSortTable, stagesWith} from './__test_support';

for (const {name, at, table} of stagesWith('pace=eager')) {
  test.describe(`an eager table, in ${name}`, () => {
    test('a held column takes each seat it crosses before it is dropped', async ({page}) => {
      await page.goto(at);
      const trades = dragSortTable(page, table(page));
      await expect(trades.columnHeader('trades')).toBeVisible();

      const hold = await trades.holdColumn('trades');
      await hold.carryTo(trades.columnHeader('vwap'));

      await expect.poll(() => trades.columnOrder()).toEqual(['window', 'buys', 'sells', 'volume', 'vwap', 'trades', 'change']);
      await hold.drop();
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

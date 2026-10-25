import {expect, test} from '@playwright/test';
import {dragSortTable, stagesWith} from './__test_support';

const columnsAsDealt = ['window', 'trades', 'buys', 'sells', 'volume', 'vwap', 'change'];
const windowsAsDealt = ['this minute', 'last 5 minutes', 'last 15 minutes', 'this hour', 'session'];

for (const {name, at, table} of stagesWith('pace=lazy')) {
  test.describe(`a lazy table, in ${name}`, () => {
    test('a held column leaves the order alone until it is dropped, then takes its seat', async ({page}) => {
      await page.goto(at);
      const trades = dragSortTable(page, table(page));
      await expect(trades.columnHeader('trades')).toBeVisible();

      const hold = await trades.holdColumn('trades');
      await hold.carryTo(trades.columnHeader('vwap'));

      expect(await trades.columnOrder()).toEqual(columnsAsDealt);

      await hold.drop();

      await expect.poll(() => trades.columnOrder()).toEqual(['window', 'buys', 'sells', 'volume', 'vwap', 'trades', 'change']);
    });

    test('a column dropped past two neighbors is said once, where it lands', async ({page}) => {
      await page.goto(at);
      const trades = dragSortTable(page, table(page));
      await expect(trades.columnHeader('trades')).toBeVisible();
      await trades.listenToTheMoveReport();

      const hold = await trades.holdColumn('trades');
      await hold.carryTo(trades.columnHeader('sells'));
      await hold.drop();

      await expect.poll(() => trades.columnOrder()).toEqual(['window', 'buys', 'sells', 'trades', 'volume', 'vwap', 'change']);
      await trades.moveColumnByKey('trades', 'ArrowRight');

      await expect.poll(() => trades.whatTheMoveReportSaid()).toEqual(['trades moved to column 4 of 7', 'trades moved to column 5 of 7']);
    });

    test('a held row leaves the windows alone until it is dropped, then takes its seat', async ({page}) => {
      await page.goto(at);
      const trades = dragSortTable(page, table(page));
      await expect(trades.columnHeader('trades')).toBeVisible();

      const hold = await trades.holdRow(1);
      await hold.carryTo(trades.row(/last 15 minutes/));

      expect(await trades.rowOrder()).toEqual(windowsAsDealt);

      await hold.drop();

      await expect.poll(() => trades.rowOrder()).toEqual(['last 5 minutes', 'last 15 minutes', 'this minute', 'this hour', 'session']);
    });
  });
}

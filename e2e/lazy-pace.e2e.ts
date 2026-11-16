import {expect} from '@playwright/test';
import {test} from './__test_support/journey';
import {tablesFrame} from './__test_support';

const columnsAsDealt = ['lookback', 'trades', 'buys', 'sells', 'volume', 'vwap', 'change'];
const lookbacksAsDealt = ['this minute', 'last 5 minutes', 'last 15 minutes', 'this hour', 'session'];

for (const stage of tablesFrame.stagesWith('pace=lazy')) {
  test.describe(`a lazy table, in ${stage.name}`, () => {
    test('a held column leaves the order alone until it is dropped, then takes its seat', async ({page}) => {
      const trades = await tablesFrame.opened(page, stage);

      const hold = await trades.holdColumn('trades');
      await hold.carryTo(trades.columnHeader('vwap'));

      expect(await trades.columnOrder()).toEqual(columnsAsDealt);

      await hold.drop();

      await expect.poll(() => trades.columnOrder()).toEqual(['lookback', 'buys', 'sells', 'volume', 'vwap', 'trades', 'change']);
    });

    test('a column dropped past two neighbors is said once, where it lands', async ({page}) => {
      const trades = await tablesFrame.opened(page, stage);
      await trades.listenToTheMoveReport();

      const hold = await trades.holdColumn('trades');
      await hold.carryTo(trades.columnHeader('sells'));
      await hold.drop();

      await expect.poll(() => trades.columnOrder()).toEqual(['lookback', 'buys', 'sells', 'trades', 'volume', 'vwap', 'change']);
      await trades.moveColumnByKey('trades', 'ArrowRight');

      await expect.poll(() => trades.whatTheMoveReportSaid()).toEqual(['trades moved to column 4 of 7', 'trades moved to column 5 of 7']);
    });

    test('a held row leaves the lookbacks alone until it is dropped, then takes its seat', async ({page}) => {
      const trades = await tablesFrame.opened(page, stage);

      const hold = await trades.holdRow(1);
      await hold.carryTo(trades.row(/last 15 minutes/));

      expect(await trades.rowOrder()).toEqual(lookbacksAsDealt);

      await hold.drop();

      await expect.poll(() => trades.rowOrder()).toEqual(['last 5 minutes', 'last 15 minutes', 'this minute', 'this hour', 'session']);
    });
  });
}

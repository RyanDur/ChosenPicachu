import {expect} from '@playwright/test';
import {test} from './__test_support/journey';
import {tableWorlds} from './__test_support';

const columnsAsDealt = ['lookback', 'trades', 'buys', 'sells', 'volume', 'vwap', 'change'];
const lookbacksAsDealt = ['this minute', 'last 5 minutes', 'last 15 minutes', 'this hour', 'session'];

for (const pace of ['eager', 'lazy']) {
  for (const stage of tableWorlds.stagesWith(`pace=${pace}`)) {
    test.describe(`a ${pace} table, in ${stage.name}`, () => {
      test('a column carried past a neighbor and home again lands nowhere and says nothing', async ({page}) => {
        const trades = await tableWorlds.opened(page, stage);
        await trades.listenToTheMoveReport();

        const hold = await trades.holdColumn('trades');
        await hold.carryTo(trades.columnHeader('sells'));
        await hold.carryHome();
        await hold.drop();

        await expect.poll(() => trades.columnOrder()).toEqual(columnsAsDealt);
        await trades.moveColumnByKey('trades', 'ArrowRight');

        await expect.poll(() => trades.whatTheMoveReportSaid()).toEqual(['trades moved to column 3 of 7']);
      });

      test('a row carried past a neighbor and home again lands nowhere and says nothing', async ({page}) => {
        const trades = await tableWorlds.opened(page, stage);
        await trades.listenToTheMoveReport();

        const hold = await trades.holdRow(1);
        await hold.carryTo(trades.row(/last 15 minutes/));
        await hold.carryHome();
        await hold.drop();

        await expect.poll(() => trades.rowOrder()).toEqual(lookbacksAsDealt);
        await trades.moveRowByKey(1, 'ArrowDown');

        await expect.poll(() => trades.whatTheMoveReportSaid()).toEqual(['this minute moved to 2 of 5']);
      });
    });
  }
}

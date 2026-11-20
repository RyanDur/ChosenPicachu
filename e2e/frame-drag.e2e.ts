import {expect, type Page} from '@playwright/test';
import {test} from './__test_support/journey';
import {type FingerPress, type Stage, tableWorlds} from './__test_support';

for (const stage of tableWorlds.stagesWith('origin=keep')) {
  test(`a column and a row still land in their new seats while their origin stays in place, in ${stage.name}`, async ({page}) => {
    const trades = await tableWorlds.opened(page, stage);

    await trades.dragColumnPast('trades', 'vwap');
    await expect.poll(() => trades.columnOrder()).toEqual(['lookback', 'buys', 'sells', 'volume', 'vwap', 'trades', 'change']);

    await trades.dragRowPast(1, /last 15 minutes/);
    await expect.poll(() => trades.rowOrder()).toEqual(['last 5 minutes', 'last 15 minutes', 'this minute', 'this hour', 'session']);
  });
}

for (const stage of tableWorlds.stages) {
  test(`a column dragged past two neighbors is reported once, where it lands, in ${stage.name}`, async ({page}) => {
    const trades = await tableWorlds.opened(page, stage);
    await trades.listenToTheMoveReport();

    await trades.dragColumnPast('trades', 'sells');
    await expect.poll(() => trades.columnOrder()).toEqual(['lookback', 'buys', 'sells', 'trades', 'volume', 'vwap', 'change']);

    await expect.poll(() => trades.whatTheMoveReportSaid()).toEqual(['trades moved to column 4 of 7']);
  });
}

for (const stage of tableWorlds.stages) {
  test(`a row dragged past two neighbors is reported once, where it lands, in ${stage.name}`, async ({page}) => {
    const trades = await tableWorlds.opened(page, stage);
    await trades.listenToTheMoveReport();

    await trades.dragRowPast(1, /last 15 minutes/);
    await expect.poll(() => trades.rowOrder()).toEqual(['last 5 minutes', 'last 15 minutes', 'this minute', 'this hour', 'session']);

    await expect.poll(() => trades.whatTheMoveReportSaid()).toEqual(['this minute moved to 3 of 5']);
  });
}

for (const stage of tableWorlds.stages) {
  test(`the first and last columns hold their posts, in ${stage.name}`, async ({page}) => {
    const trades = await tableWorlds.opened(page, stage);

    await trades.dragColumnPast('lookback', 'buys');
    await trades.dragColumnPast('change', 'volume');
    await expect.poll(() => trades.columnOrder()).toEqual(['lookback', 'trades', 'buys', 'sells', 'volume', 'vwap', 'change']);

    await trades.dragColumnPast('buys', 'lookback');
    await expect.poll(() => trades.columnOrder()).toEqual(['lookback', 'buys', 'trades', 'sells', 'volume', 'vwap', 'change']);
  });
}

for (const stage of tableWorlds.stages) {
  test(`a menu choice sorts, and never lifts the column, in ${stage.name}`, async ({page}) => {
    const trades = await tableWorlds.opened(page, stage);

    await trades.sortBy('trades', 'descending');

    await expect(trades.columnHeader('trades')).toHaveAttribute('aria-sort', 'descending');
    await expect.poll(() => trades.columnOrder()).toEqual(['lookback', 'trades', 'buys', 'sells', 'volume', 'vwap', 'change']);
  });
}

const aFingerCarriesTheColumn = async (
  page: Page,
  browserName: string,
  stage: Stage,
  from: FingerPress
): Promise<void> => {
  test.skip(browserName !== 'chromium', 'only Chromium\'s DevTools protocol moves a finger through a drag');
  const trades = await tableWorlds.opened(page, stage);

  await trades.fingerDragColumn('trades', {by: 240, from});

  await expect.poll(async () => (await trades.columnOrder()).indexOf('trades')).toBeGreaterThan(1);
};

test.describe('a reader on a phone or an iPad held upright', {tag: ['@iPhone', '@iPadUpright']}, () => {
  for (const stage of tableWorlds.stages) {
    test(`a finger pressed on a column's name carries it to a new seat, in ${stage.name}`, ({page, browserName}) =>
      aFingerCarriesTheColumn(page, browserName, stage, 'name'));
  }
});

test.describe('a reader on a phone', {tag: '@iPhone'}, () => {
  for (const stage of tableWorlds.stages) {
    test(`a finger pressed on a column's middle carries it to a new seat, in ${stage.name}`, ({page, browserName}) =>
      aFingerCarriesTheColumn(page, browserName, stage, 'middle'));
  }
});

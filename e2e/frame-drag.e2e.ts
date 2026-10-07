import {expect, test} from '@playwright/test';
import {dragSortTable, iPadUpright, iPhone, stages} from './__test_support';

for (const {name, at, table} of stages) {
  test(`a trader drags a column and a row into new seats without the page erring, in ${name}`, async ({page}) => {
    const troubles: string[] = [];
    page.on('pageerror', error => troubles.push(String(error)));
    await page.goto(at);
    const trades = dragSortTable(page, table(page));
    await expect(trades.columnHeader('trades')).toBeVisible();

    await trades.dragColumnPast('trades', 'vwap');
    await expect.poll(() => trades.columnOrder()).toEqual(['window', 'buys', 'sells', 'volume', 'vwap', 'trades', 'change']);

    await trades.dragRowPast(1, /last 15 minutes/);
    await expect.poll(() => trades.rowOrder()).toEqual(['last 5 minutes', 'last 15 minutes', 'this minute', 'this hour', 'session']);

    expect(troubles).toEqual([]);
  });
}

for (const {name, at, table} of stages) {
  test(`a column dragged past two neighbours is reported once, where it lands, in ${name}`, async ({page}) => {
    await page.goto(at);
    const trades = dragSortTable(page, table(page));
    await expect(trades.columnHeader('trades')).toBeVisible();
    await trades.listenToTheMoveReport();

    await trades.dragColumnPast('trades', 'sells');
    await expect.poll(() => trades.columnOrder()).toEqual(['window', 'buys', 'sells', 'trades', 'volume', 'vwap', 'change']);

    await expect.poll(() => trades.whatTheMoveReportSaid()).toEqual(['trades moved to column 4 of 7']);
  });
}

test('a menu choice sorts, and never lifts the column', async ({page}) => {
  const vanilla = stages[1];
  await page.goto(vanilla.at);
  const trades = dragSortTable(page, vanilla.table(page));
  await expect(trades.columnHeader('trades')).toBeVisible();

  await trades.sortBy('trades', 'descending');

  await expect(trades.columnHeader('trades')).toHaveAttribute('aria-sort', 'descending');
  await expect.poll(() => trades.columnOrder()).toEqual(['window', 'trades', 'buys', 'sells', 'volume', 'vwap', 'change']);
});

for (const {reader, device, presses} of [
  {reader: 'an iPad held upright', device: iPadUpright, presses: ['name'] as const},
  {reader: 'a phone', device: iPhone, presses: ['name', 'middle'] as const}
]) {
  test.describe(reader, () => {
    test.use(device);

    for (const {name, at, table} of stages) {
      for (const from of presses) {
        test(`a finger pressed on a column's ${from} carries it to a new seat, in ${name}`, async ({page, browserName}) => {
          test.skip(browserName !== 'chromium', 'only Chromium\'s DevTools protocol moves a finger through a drag');
          await page.goto(at);
          const trades = dragSortTable(page, table(page));
          await expect(trades.columnHeader('trades')).toBeVisible();

          await trades.fingerDragColumn('trades', {by: 240, from});

          await expect.poll(async () => (await trades.columnOrder()).indexOf('trades')).toBeGreaterThan(1);
        });
      }
    }
  });
}

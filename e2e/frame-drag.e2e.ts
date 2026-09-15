import {expect, test} from '@playwright/test';
import {dragSortTable, stages} from './__test_support';

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

test('a menu choice sorts, and never lifts the column', async ({page}) => {
  const vanilla = stages[1];
  await page.goto(vanilla.at);
  const trades = dragSortTable(page, vanilla.table(page));
  await expect(trades.columnHeader('trades')).toBeVisible();

  await trades.sortBy('trades', 'descending');

  await expect(trades.columnHeader('trades')).toHaveAttribute('aria-sort', 'descending');
  await expect.poll(() => trades.columnOrder()).toEqual(['window', 'trades', 'buys', 'sells', 'volume', 'vwap', 'change']);
});

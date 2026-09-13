import {expect, test} from '@playwright/test';
import {columnHeader, columnOrder, dragColumnPast, dragRowPast, rowOrder, sortBy, stages} from './__test_support';

for (const {name, at, table} of stages) {
  test(`a trader drags a column and a row into new seats without the page erring, in ${name}`, async ({page}) => {
    const troubles: string[] = [];
    page.on('pageerror', error => troubles.push(String(error)));
    await page.goto(at);
    const frame = table(page);
    await expect(columnHeader(frame, 'trades')).toBeVisible();

    await dragColumnPast(page, frame, 'trades', 'vwap');
    await expect.poll(columnOrder(frame)).toEqual(['window', 'buys', 'sells', 'volume', 'vwap', 'trades', 'change']);

    await dragRowPast(page, frame, 1, /last 15 minutes/);
    await expect.poll(rowOrder(frame)).toEqual(['last 5 minutes', 'last 15 minutes', 'this minute', 'this hour', 'session']);

    expect(troubles).toEqual([]);
  });
}

test('a menu choice sorts, and never lifts the column', async ({page}) => {
  const [, vanilla] = stages;
  await page.goto(vanilla.at);
  const frame = vanilla.table(page);
  await expect(columnHeader(frame, 'trades')).toBeVisible();

  await sortBy(frame, 'trades', 'descending');

  await expect(columnHeader(frame, 'trades')).toHaveAttribute('aria-sort', 'descending');
  await expect.poll(columnOrder(frame)).toEqual(['window', 'trades', 'buys', 'sells', 'volume', 'vwap', 'change']);
});

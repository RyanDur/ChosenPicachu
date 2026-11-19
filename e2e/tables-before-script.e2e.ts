import {expect} from '@playwright/test';
import {test} from './__test_support/journey';
import {dragSortTable, hydration, tableWorlds, tabsTo} from './__test_support';

const address = 'demos/tables/?world=react';

test('given the tables tab before its script runs, a row grip is disabled; once the script runs, a drag from it moves the row', async ({page}) => {
  await hydration(page).holdBack(address);
  await page.goto(address);
  const trades = dragSortTable(page, tableWorlds.card(page).card);

  await expect(trades.grip(1)).toBeDisabled();
  await hydration(page).release();

  const hold = await trades.holdRow(1);
  await hold.carryTo(trades.row(/last 15 minutes/));
  await hold.drop();
  await expect.poll(() => trades.rowOrder()).toEqual(['last 5 minutes', 'last 15 minutes', 'this minute', 'this hour', 'session']);
});

test('given the tables tab before its script runs, a resize handle is disabled; once the script runs, a drag on it resizes the column', async ({page}) => {
  await hydration(page).holdBack(address);
  await page.goto(address);
  const trades = dragSortTable(page, tableWorlds.card(page).card);

  await expect(trades.resizeHandle('volume')).toBeDisabled();
  await hydration(page).release();

  await trades.focusHandle('volume');
  const before = await trades.announcedShare('volume');
  await trades.dragEdge('volume', {by: 60, moves: 10});
  await expect.poll(() => trades.announcedShare('volume')).toBeGreaterThan(before);
});

for (const pace of ['eager', 'lazy']) {
  const paced = `${address}&pace=${pace}`;

  test(`given the tables tab at the ${pace} pace before its script runs, Tab passes over a movable column header; once the script runs, Tab stops on it and an arrow moves the column`, async ({page}) => {
    await hydration(page).holdBack(paced);
    await page.goto(paced);
    const trades = dragSortTable(page, tableWorlds.card(page).card);

    await tabsTo(page, trades.columnHeader('trades'));
    await expect(trades.columnHeader('trades')).not.toBeFocused();
    await hydration(page).release();

    await expect(trades.resizeHandle('lookback')).toBeEnabled();
    await trades.resizeHandle('lookback').focus();
    await tabsTo(page, trades.columnHeader('trades'));
    await expect(trades.columnHeader('trades')).toBeFocused();
    await page.keyboard.press('ArrowRight');
    await expect.poll(() => trades.columnOrder()).toEqual(['lookback', 'buys', 'trades', 'sells', 'volume', 'vwap', 'change']);
  });
}

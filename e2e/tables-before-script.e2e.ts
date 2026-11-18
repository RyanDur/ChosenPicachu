import {expect} from '@playwright/test';
import {test} from './__test_support/journey';
import {dragSortTable, hydration, tableWorlds} from './__test_support';

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

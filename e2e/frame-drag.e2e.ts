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

for (const {name, at, table} of stages) {
  for (const pace of ['eager', 'lazy']) {
    test(`a column let go past its crossing settles from where it was carried, ${pace}, in ${name}`, async ({page}) => {
      await page.goto(`${at}&pace=${pace}&origin=hide&motion=animated`);
      const trades = dragSortTable(page, table(page));
      await expect(trades.columnHeader('trades')).toBeVisible();
      const buys = await trades.centreOfColumn('buys');
      const letGo = {x: buys.x + 8, y: buys.y + 6};

      const carriedTo = await trades.dropColumnAt('trades', letGo);

      await expect.poll(trades.columnSettlesFrom('trades', carriedTo)).toBeLessThanOrEqual(1);
    });

    test(`a column dropped with the origin kept settles from the seat it left, ${pace}, in ${name}`, async ({page}) => {
      await page.goto(`${at}&pace=${pace}&origin=keep&motion=animated`);
      const trades = dragSortTable(page, table(page));
      await expect(trades.columnHeader('trades')).toBeVisible();
      const seatItLeft = await trades.centreOfColumn('trades');
      const buys = await trades.centreOfColumn('buys');

      await trades.dropColumnAt('trades', {x: buys.x + 8, y: buys.y});

      await expect.poll(trades.columnSettlesFrom('trades', seatItLeft)).toBeLessThanOrEqual(1);
    });

    test(`a row dropped with the origin kept settles from the seat it left, ${pace}, in ${name}`, async ({page}) => {
      await page.goto(`${at}&pace=${pace}&origin=keep&motion=animated`);
      const trades = dragSortTable(page, table(page));
      await expect(trades.columnHeader('trades')).toBeVisible();
      const seatItLeft = await trades.centreOfRowHeader(/this minute/);
      const grip = await trades.centreOfRowGrip(1);
      const passed = await trades.centreOfRow(/last 5 minutes/);

      await trades.dropRowAt({row: 1, name: /this minute/}, {x: grip.x, y: passed.y + 8});

      await expect.poll(trades.rowSettlesFrom(/this minute/, seatItLeft)).toBeLessThanOrEqual(1);
    });

    test(`a row let go past its crossing settles from where it was carried, ${pace}, in ${name}`, async ({page}) => {
      await page.goto(`${at}&pace=${pace}&origin=hide&motion=animated`);
      const trades = dragSortTable(page, table(page));
      await expect(trades.columnHeader('trades')).toBeVisible();
      const grip = await trades.centreOfRowGrip(1);
      const passed = await trades.centreOfRow(/last 5 minutes/);
      const letGo = {x: grip.x, y: passed.y + 8};

      const carriedTo = await trades.dropRowAt({row: 1, name: /this minute/}, letGo);

      await expect.poll(trades.rowSettlesFrom(/this minute/, carriedTo)).toBeLessThanOrEqual(1);
    });
  }
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

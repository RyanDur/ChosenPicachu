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

for (const {name, at, table} of stages) {
  for (const pace of ['eager', 'lazy']) {
    test(`a column let go past its crossing settles from where it was carried, ${pace}, in ${name}`, async ({page}) => {
      await page.goto(`${at}&pace=${pace}&origin=hide&motion=animated`);
      const trades = dragSortTable(page, table(page));
      await expect(trades.columnHeader('trades')).toBeVisible();
      const buys = await trades.centreOfColumn('buys');
      const letGo = {x: buys.x + 8, y: buys.y + 6};

      const carriedTo = await trades.dropColumnAt('trades', letGo);

      await expect.poll(trades.columnMovesFrom('trades', carriedTo)).toBeLessThanOrEqual(1);
    });

    test(`a column dropped with the origin kept settles from the seat it left, ${pace}, in ${name}`, async ({page}) => {
      await page.goto(`${at}&pace=${pace}&origin=keep&motion=animated`);
      const trades = dragSortTable(page, table(page));
      await expect(trades.columnHeader('trades')).toBeVisible();
      const seatItLeft = await trades.centreOfColumn('trades');
      const buys = await trades.centreOfColumn('buys');

      await trades.dropColumnAt('trades', {x: buys.x + 8, y: buys.y});

      await expect.poll(trades.columnMovesFrom('trades', seatItLeft)).toBeLessThanOrEqual(1);
    });

    test(`a row dropped with the origin kept settles from the seat it left, ${pace}, in ${name}`, async ({page}) => {
      await page.goto(`${at}&pace=${pace}&origin=keep&motion=animated`);
      const trades = dragSortTable(page, table(page));
      await expect(trades.columnHeader('trades')).toBeVisible();
      const seatItLeft = await trades.centreOfRowHeader(/this minute/);
      const grip = await trades.centreOfRowGrip(1);
      const passed = await trades.centreOfRow(/last 5 minutes/);

      await trades.dropRowAt({row: 1, name: /this minute/}, {x: grip.x, y: passed.y + 8});

      await expect.poll(trades.rowMovesFrom(/this minute/, seatItLeft)).toBeLessThanOrEqual(1);
    });

    test(`a column walked one seat by the arrow key settles from the seat it left, ${pace}, in ${name}`, async ({page}) => {
      await page.goto(`${at}&pace=${pace}`);
      const trades = dragSortTable(page, table(page));
      await expect(trades.columnHeader('trades')).toBeVisible();
      const seatItLeft = await trades.centreOfColumn('trades');

      await trades.walkColumn('trades', 'ArrowRight');

      await expect.poll(trades.columnMovesFrom('trades', seatItLeft)).toBeLessThanOrEqual(1);
    });

    test(`a row walked one seat by the arrow key settles from the seat it left, ${pace}, in ${name}`, async ({page}) => {
      await page.goto(`${at}&pace=${pace}`);
      const trades = dragSortTable(page, table(page));
      await expect(trades.columnHeader('trades')).toBeVisible();
      const seatItLeft = await trades.centreOfRowHeader(/this minute/);

      await trades.walkRow({row: 1, name: /this minute/}, 'ArrowDown');

      await expect.poll(trades.rowMovesFrom(/this minute/, seatItLeft)).toBeLessThanOrEqual(1);
    });

    test(`a column passed by a walk is shoved from the seat it left, by the walked column's width, ${pace}, in ${name}`, async ({page}) => {
      await page.goto(`${at}&pace=${pace}`);
      const trades = dragSortTable(page, table(page));
      await expect(trades.columnHeader('trades')).toBeVisible();
      const seatItLeft = await trades.centreOfColumn('buys');

      await trades.walkColumn('trades', 'ArrowRight', {watching: 'buys'});

      await expect.poll(trades.columnMovesFrom('buys', seatItLeft)).toBeLessThanOrEqual(1);
    });

    test(`a row passed by a walk is shoved from the seat it left, by the walked row's height, ${pace}, in ${name}`, async ({page}) => {
      await page.goto(`${at}&pace=${pace}`);
      const trades = dragSortTable(page, table(page));
      await expect(trades.columnHeader('trades')).toBeVisible();
      const seatItLeft = await trades.centreOfRowHeader(/last 5 minutes/);

      await trades.walkRow({row: 1, name: /this minute/}, 'ArrowDown', {watching: /last 5 minutes/});

      await expect.poll(trades.rowMovesFrom(/last 5 minutes/, seatItLeft)).toBeLessThanOrEqual(1);
    });

    test(`a column passed by a carry is shoved from the seat it left, ${pace}, in ${name}`, async ({page}) => {
      await page.goto(`${at}&pace=${pace}`);
      const trades = dragSortTable(page, table(page));
      await expect(trades.columnHeader('trades')).toBeVisible();
      const seatItLeft = await trades.centreOfColumn('buys');

      await trades.dropColumnAt('trades', {x: seatItLeft.x + 8, y: seatItLeft.y}, {watching: 'buys'});

      await expect.poll(trades.columnMovesFrom('buys', seatItLeft)).toBeLessThanOrEqual(1);
    });

    test(`a row passed by a carry is shoved from the seat it left, ${pace}, in ${name}`, async ({page}) => {
      await page.goto(`${at}&pace=${pace}`);
      const trades = dragSortTable(page, table(page));
      await expect(trades.columnHeader('trades')).toBeVisible();
      const seatItLeft = await trades.centreOfRowHeader(/last 5 minutes/);
      const grip = await trades.centreOfRowGrip(1);

      await trades.dropRowAt({row: 1, name: /this minute/}, {x: grip.x, y: seatItLeft.y + 8}, {watching: /last 5 minutes/});

      await expect.poll(trades.rowMovesFrom(/last 5 minutes/, seatItLeft)).toBeLessThanOrEqual(1);
    });

    test(`a row let go past its crossing settles from where it was carried, ${pace}, in ${name}`, async ({page}) => {
      await page.goto(`${at}&pace=${pace}&origin=hide&motion=animated`);
      const trades = dragSortTable(page, table(page));
      await expect(trades.columnHeader('trades')).toBeVisible();
      const grip = await trades.centreOfRowGrip(1);
      const passed = await trades.centreOfRow(/last 5 minutes/);
      const letGo = {x: grip.x, y: passed.y + 8};

      const carriedTo = await trades.dropRowAt({row: 1, name: /this minute/}, letGo);

      await expect.poll(trades.rowMovesFrom(/this minute/, carriedTo)).toBeLessThanOrEqual(1);
    });
  }
}

for (const {name, at, table} of stages) {
  for (const pace of ['eager', 'lazy']) {
    test(`a carried column stays under the pointer from the press, in one move or many, right or left, ${pace}, in ${name}`, async ({page}) => {
      await page.goto(`${at}&pace=${pace}`);
      const trades = dragSortTable(page, table(page));
      await expect(trades.columnHeader('trades')).toBeVisible();
      const trails: string[] = [];

      expect(await trades.howFarTheLiftJumps('trades')).toBeLessThanOrEqual(1);
      for (const by of [120, -120]) {
        for (const steps of [1, 20, 60]) {
          const trail = await trades.howFarTheCarryTrails('trades', {by, steps});
          if (trail > 1) {
            trails.push(`${by}px in ${steps}: ${trail.toFixed(1)}px`);
          }
        }
      }

      expect(trails).toEqual([]);
    });
  }
}

test.describe('an iPad held upright', () => {
  test.use(iPadUpright);

  for (const {name, at, table} of stages) {
    test(`a column carried by a finger from its header's middle stays under it from the press, in ${name}`, async ({page, browserName}) => {
      test.skip(browserName !== 'chromium', 'only Chromium\'s DevTools protocol moves a finger through a drag');
      await page.goto(at);
      const trades = dragSortTable(page, table(page));
      await expect(trades.columnHeader('trades')).toBeVisible();
      const trails: string[] = [];

      for (const by of [120, -120]) {
        for (const steps of [1, 20]) {
          const trail = await trades.howFarAFingersCarryTrails('trades', {by, steps, from: 'middle'});
          if (trail > 1) {
            trails.push(`${by}px in ${steps}: ${trail.toFixed(1)}px`);
          }
        }
      }

      expect(trails).toEqual([]);
    });
  }
});

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
        test(`a finger pressed on a column's ${from} lifts and carries it, in ${name}`, async ({page, browserName}) => {
          test.skip(browserName !== 'chromium', 'only Chromium\'s DevTools protocol moves a finger through a drag');
          await page.goto(at);
          const trades = dragSortTable(page, table(page));
          await expect(trades.columnHeader('trades')).toBeVisible();

          expect(await trades.howFarAFingersCarryTrails('trades', {by: 120, steps: 20, from})).toBeLessThanOrEqual(1);
        });
      }
    }
  });
}

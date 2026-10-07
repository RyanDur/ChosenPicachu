import {expect, test} from '@playwright/test';
import {dragSortTable, iPhone, phoneSideways, stages} from './__test_support';

for (const stage of stages) {
  for (const {reader, device} of [{reader: 'a phone', device: iPhone}, {reader: 'a phone held sideways', device: phoneSideways}]) {
    test.describe(`${reader}, in ${stage.name}`, () => {
      test.use(device);

      test.beforeEach(async ({page}) => {
        await page.goto(stage.at);
        await expect(dragSortTable(page, stage.table(page)).columnHeader('trades')).toBeVisible({timeout: 30_000});
      });

      test('narrows buys to a stop, and buys\' sort control still opens its menu', async ({page}) => {
        const table = dragSortTable(page, stage.table(page));
        await table.dragEdge('buys', {by: -400, moves: 20});
        const stopped = await table.announcedShare('buys');

        await table.dragEdge('buys', {by: -400, moves: 20});

        await expect.poll(() => table.announcedShare('buys')).toBe(stopped);
        await table.sortToggle('buys').tap();
        await expect(table.sortMenu('buys')).toBeVisible();
      });

      test('widens buys into sells to a stop, and sells\' sort control still opens its menu', async ({page}) => {
        const table = dragSortTable(page, stage.table(page));
        await table.dragEdge('buys', {by: 400, moves: 20});
        const stopped = await table.announcedShare('sells');

        await table.dragEdge('buys', {by: 400, moves: 20});

        await expect.poll(() => table.announcedShare('sells')).toBe(stopped);
        await table.sortToggle('sells').tap();
        await expect(table.sortMenu('sells')).toBeVisible();
      });

      test('stops buys by keyboard within a point of the share a drag stops it at', async ({page, context}) => {
        const dragged = dragSortTable(page, stage.table(page));
        await dragged.dragEdge('buys', {by: -400, moves: 20});
        const other = await context.newPage();
        await other.goto(stage.at);
        const keyed = dragSortTable(other, stage.table(other));
        await expect(keyed.columnHeader('trades')).toBeVisible({timeout: 30_000});

        await keyed.narrowByKeys('buys', 40);

        const draggedShare = await dragged.announcedShare('buys');
        await expect.poll(async () => Math.abs(await keyed.announcedShare('buys') - draggedShare)).toBeLessThanOrEqual(1);
      });

      test('opens the buys sort menu from a finger on its sort control', async ({page}) => {
        const table = dragSortTable(page, stage.table(page));

        await table.sortToggle('buys').tap();

        await expect(table.sortMenu('buys')).toBeVisible();
      });

      test('gives volume the share vwap gives up, from a mouse dragged where the two meet, and opens no menu', async ({page}) => {
        const table = dragSortTable(page, stage.table(page));
        await table.dragFromWhereHeadersMeet('volume', 20);
        const [volume, vwap] = [await table.announcedShare('volume'), await table.announcedShare('vwap')];

        await table.dragFromWhereHeadersMeet('volume', 20);

        await expect.poll(() => table.announcedShare('volume')).toBeGreaterThan(volume);
        expect(await table.announcedShare('vwap')).toBeLessThan(vwap);
        await expect(table.sortMenu('vwap')).toBeHidden();
      });
    });
  }
}

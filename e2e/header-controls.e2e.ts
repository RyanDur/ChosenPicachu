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

      test('keeps every control of a column inside that column\'s header', async ({page}) => {
        const table = dragSortTable(page, stage.table(page));

        expect(await table.controlsPastTheirHeader()).toEqual([]);
      });

      test('keeps buys\' controls inside its header when its edge is dragged as far toward its start as it goes', async ({page}) => {
        const table = dragSortTable(page, stage.table(page));

        await table.dragEdge('buys', {by: -400, moves: 20});

        expect(await table.controlsPastTheirHeader()).toEqual([]);
      });

      test('keeps sells\' controls inside its header when buys is widened into it as far as it goes', async ({page}) => {
        const table = dragSortTable(page, stage.table(page));

        await table.dragEdge('buys', {by: 400, moves: 20});

        expect(await table.controlsPastTheirHeader()).toEqual([]);
      });

      test('stops buys by keyboard where a drag stops it, and names the share it took', async ({page, context}) => {
        const dragged = dragSortTable(page, stage.table(page));
        await dragged.dragEdge('buys', {by: -400, moves: 20});
        const other = await context.newPage();
        await other.goto(stage.at);
        const keyed = dragSortTable(other, stage.table(other));
        await expect(keyed.columnHeader('trades')).toBeVisible({timeout: 30_000});

        await keyed.narrowByKeys('buys', 40);

        expect(Math.abs(await keyed.columnWidth('buys') - await dragged.columnWidth('buys'))).toBeLessThanOrEqual(1);
        expect(await keyed.controlsPastTheirHeader()).toEqual([]);
        expect(await keyed.announcedShare('buys')).toBe(Math.round(await keyed.shareOf('buys')));
      });

      test('opens the buys sort menu from a finger on its sort control', async ({page}) => {
        const table = dragSortTable(page, stage.table(page));

        await table.sortToggle('buys').tap();

        await expect(table.sortMenu('buys')).toBeVisible();
      });

      test('gives volume the width vwap gives up, from a mouse dragged where the two meet', async ({page}) => {
        const table = dragSortTable(page, stage.table(page));
        const volume = await table.columnWidth('volume');
        const vwap = await table.columnWidth('vwap');

        await table.dragFromWhereHeadersMeet('volume', 40);

        await expect.poll(() => table.columnWidth('volume')).toBeGreaterThan(volume + 20);
        expect(await table.columnWidth('volume') + await table.columnWidth('vwap')).toBeCloseTo(volume + vwap, 0);
        await expect(table.sortMenu('vwap')).toBeHidden();
      });
    });
  }
}

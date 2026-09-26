import {expect, test} from '@playwright/test';
import {dragSortTable, iPadUpright, iPhone, stages} from './__test_support';

const offTheLine = 21;

for (const stage of stages) {
  for (const {reader, device} of [{reader: 'an iPad held upright', device: iPadUpright}, {reader: 'a phone', device: iPhone}]) {
    test.describe(`${reader}, in ${stage.name}`, () => {
      test.use(device);

      test('widens a column from a press under a coarse pointer just off its edge', async ({page}) => {
        await page.goto(stage.at);
        const table = dragSortTable(page, stage.table(page));
        await expect(table.columnHeader('trades')).toBeVisible({timeout: 30_000});
        const before = await table.columnWidth('trades');

        await table.pressBesideEdgeAndDrag('trades', {besideBy: offTheLine, by: 60});

        await expect.poll(() => table.columnWidth('trades')).toBeGreaterThan(before + 20);
      });

      test('opens the sort menu from a finger on the toggle beside the edge, and resizes nothing', async ({page}) => {
        await page.goto(stage.at);
        const tables = stage.table(page);
        const table = dragSortTable(page, tables);
        await expect(table.columnHeader('trades')).toBeVisible({timeout: 30_000});
        const before = await table.columnWidth('trades');

        await tables.getByRole('button', {name: 'sort trades'}).tap();

        await expect(tables.getByLabel('sort trades by')).toBeVisible();
        expect(await table.columnWidth('trades')).toBe(before);
      });
    });
  }
}

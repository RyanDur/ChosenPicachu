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

      test('opens the buys sort menu from a finger on its sort control', async ({page}) => {
        const table = dragSortTable(page, stage.table(page));

        await table.sortToggle('buys').tap();

        await expect(table.sortMenu('buys')).toBeVisible();
      });

      test('gives buys the width sells gives up, from a mouse dragged where the two meet', async ({page}) => {
        const table = dragSortTable(page, stage.table(page));
        const buys = await table.columnWidth('buys');
        const sells = await table.columnWidth('sells');

        await table.dragFromWhereHeadersMeet('buys', 40);

        await expect.poll(() => table.columnWidth('buys')).toBeGreaterThan(buys + 20);
        expect(await table.columnWidth('buys') + await table.columnWidth('sells')).toBeCloseTo(buys + sells, 0);
        await expect(table.sortMenu('sells')).toBeHidden();
      });
    });
  }
}

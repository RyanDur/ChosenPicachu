import {expect, test} from '@playwright/test';
import {dragSortTable, iPhone, phoneSideways, stages} from './__test_support';

const sortable = ['trades', 'buys', 'sells', 'volume', 'vwap', 'change'];
const seams = [['window', 'trades'], ['trades', 'buys'], ['buys', 'sells'], ['sells', 'volume'], ['volume', 'vwap'], ['vwap', 'change']];

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

      for (const column of sortable) {
        test(`opens the ${column} sort menu from a finger on its sort control`, async ({page}) => {
          const table = dragSortTable(page, stage.table(page));

          await table.sortToggle(column).tap();

          await expect(table.sortMenu(column)).toBeVisible();
        });
      }

      for (const [left, right] of seams) {
        test(`resizes ${left} alone from a drag where ${left} meets ${right}`, async ({page}) => {
          const table = dragSortTable(page, stage.table(page));
          const before = await table.columnWidth(left);

          await table.dragFromWhereHeadersMeet(left, 40);

          await expect.poll(() => table.columnWidth(left)).toBeGreaterThan(before + 20);
          await expect(table.sortMenu(right)).toBeHidden();
        });
      }
    });
  }
}

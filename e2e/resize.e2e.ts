import {Page, expect, test} from '@playwright/test';
import {Stage, desktop, dragSortTable, fingertipMiss, iPadUpright, iPhone, stages} from './__test_support';

const tradesShareAfterDragging = async (page: Page, stage: Stage, moves: number): Promise<string | null> => {
  await page.goto(stage.at);
  const table = dragSortTable(page, stage.table(page));
  await expect(table.columnHeader('trades')).toBeVisible({timeout: 30_000});
  await table.dragEdge('trades', {by: 120, moves});
  return table.resizeName('trades');
};

for (const stage of stages) {
  for (const {reader, device} of [{reader: 'an iPad held upright', device: iPadUpright}, {reader: 'a phone', device: iPhone}]) {
    test.describe(`${reader}, in ${stage.name}`, () => {
      test.use(device);

      test('widens a column from a press under a coarse pointer just off its edge', async ({page}) => {
        await page.goto(stage.at);
        const table = dragSortTable(page, stage.table(page));
        await expect(table.columnHeader('trades')).toBeVisible({timeout: 30_000});
        const before = await table.columnWidth('trades');

        await table.pressBesideEdgeAndDrag('trades', {besideBy: fingertipMiss, by: 60});

        await expect.poll(() => table.columnWidth('trades')).toBeGreaterThan(before + 20);
      });

      test('opens the sort menu from a finger on the toggle beside the edge, and resizes nothing', async ({page}) => {
        await page.goto(stage.at);
        const table = dragSortTable(page, stage.table(page));
        await expect(table.columnHeader('trades')).toBeVisible({timeout: 30_000});
        const before = await table.columnWidth('trades');

        await table.sortToggle('trades').tap();

        await expect(table.sortMenu('trades')).toBeVisible();
        expect(await table.columnWidth('trades')).toBe(before);
      });
    });
  }

  test.describe(`a desktop with a mouse, in ${stage.name}`, () => {
    test.use(desktop);

    test('a flick that leaves the edge in one move widens a column as far as a slow drag does', async ({page, browser, baseURL}) => {
      const slow = await browser.newPage({...desktop, baseURL});

      const flicked = await tradesShareAfterDragging(page, stage, 1);

      expect(flicked).toBe(await tradesShareAfterDragging(slow, stage, 20));
      expect(flicked).not.toBe('resize trades, 13%');
      await slow.close();
    });

    test('a flicked handle lets go, so the next press starts a new resize', async ({page}) => {
      const flicked = await tradesShareAfterDragging(page, stage, 1);
      const table = dragSortTable(page, stage.table(page));

      await table.dragEdge('trades', {by: -40, moves: 5});

      expect(await table.resizeName('trades')).not.toBe(flicked);
    });
  });
}

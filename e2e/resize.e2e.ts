import {Locator, Page, expect, test} from '@playwright/test';
import {Stage, desktop, dragSortTable, fingertipMiss, iPadUpright, iPhone, stages} from './__test_support';

const standing = async (page: Page, stage: Stage) => {
  await page.goto(stage.at);
  const table = dragSortTable(page, stage.table(page));
  await expect(table.columnHeader('trades')).toBeVisible({timeout: 30_000});
  return table;
};

const namingAShare = /, \d+%$/;

const nameOf = async (handle: Locator): Promise<string> => {
  const name = await handle.getAttribute('aria-label');
  expect(name).toMatch(namingAShare);
  return String(name);
};

const nameOnceMoved = async (handle: Locator, from: string): Promise<string> => {
  await expect(handle).not.toHaveAccessibleName(from);
  return nameOf(handle);
};

const measuredName = async (handle: Locator): Promise<string> => {
  await handle.focus();
  await expect(handle).toHaveAccessibleName(namingAShare);
  return nameOf(handle);
};

for (const stage of stages) {
  for (const {reader, device} of [{reader: 'an iPad held upright', device: iPadUpright}, {reader: 'a phone', device: iPhone}]) {
    test.describe(`${reader}, in ${stage.name}`, () => {
      test.use(device);

      test('widens a column from a press under a coarse pointer just off its edge', async ({page}) => {
        const table = await standing(page, stage);
        const before = await table.columnWidth('trades');

        await table.pressBesideEdgeAndDrag('trades', {besideBy: fingertipMiss, by: 60});

        await expect.poll(() => table.columnWidth('trades')).toBeGreaterThan(before + 20);
      });

      test('opens the sort menu from a finger on the toggle beside the edge, and resizes nothing', async ({page}) => {
        const table = await standing(page, stage);
        const before = await table.columnWidth('trades');

        await table.sortToggle('trades').tap();

        await expect(table.sortMenu('trades')).toBeVisible();
        expect(await table.columnWidth('trades')).toBe(before);
      });
    });
  }

  test.describe(`a desktop with a mouse, in ${stage.name}`, () => {
    test.use(desktop);

    test('a flick that leaves the edge in one move widens a column as far as a slow drag does', async ({page, context}) => {
      const slow = await standing(await context.newPage(), stage);
      const flicked = await standing(page, stage);
      const startingName = await measuredName(slow.resizeHandle('trades'));
      await slow.dragEdge('trades', {by: 120, moves: 20});
      const slowName = await nameOnceMoved(slow.resizeHandle('trades'), startingName);

      await flicked.dragEdge('trades', {by: 120, moves: 1});

      await expect(flicked.resizeHandle('trades')).toHaveAccessibleName(slowName);
    });

    test('a flicked handle lets go: its name takes the new share, and the next press starts a new resize', async ({page}) => {
      const table = await standing(page, stage);
      const startingName = await measuredName(table.resizeHandle('trades'));
      await table.dragEdge('trades', {by: 120, moves: 1});
      const flickedName = await nameOnceMoved(table.resizeHandle('trades'), startingName);

      await table.dragEdge('trades', {by: -40, moves: 5});

      await expect(table.resizeHandle('trades')).not.toHaveAccessibleName(flickedName);
    });
  });
}

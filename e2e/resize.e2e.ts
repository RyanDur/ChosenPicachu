import {expect, Locator} from '@playwright/test';
import {test} from './__test_support/journey';
import {arrivalPatience, desktop, fingertipMiss, iPadUpright, iPhone, tableWorlds} from './__test_support';

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

for (const stage of tableWorlds.stages) {
  for (const {reader, device} of [{reader: 'an iPad held upright', device: iPadUpright}, {reader: 'a phone', device: iPhone}]) {
    test.describe(`${reader}, in ${stage.name}`, () => {
      test.use(device);

      test('widens a column from a press under a coarse pointer just off its edge', async ({page}) => {
        const table = await tableWorlds.opened(page, stage, {patience: arrivalPatience});
        await table.pressBesideEdgeAndDrag('volume', {besideBy: fingertipMiss, by: 30});
        const before = await table.announcedShare('volume');

        await table.pressBesideEdgeAndDrag('volume', {besideBy: fingertipMiss, by: 60});

        await expect.poll(() => table.announcedShare('volume')).toBeGreaterThan(before);
      });

      test('opens the sort menu from a finger on the toggle beside the edge, and resizes nothing', async ({page}) => {
        const table = await tableWorlds.opened(page, stage, {patience: arrivalPatience});

        await table.sortToggle('trades').tap();

        await expect(table.sortMenu('trades')).toBeVisible();
        await expect(table.resizeHandle('trades')).toHaveAccessibleName('resize trades');
      });
    });
  }

  test.describe(`a desktop with a mouse, in ${stage.name}`, () => {
    test.use(desktop);

    test('a column still narrows to 5% under a mouse', async ({page}) => {
      const table = await tableWorlds.opened(page, stage, {patience: arrivalPatience});

      await table.dragEdge('buys', {by: -600, moves: 20});

      await expect(table.resizeHandle('buys')).toHaveAccessibleName('resize buys, 5%');
    });

    test('a flick that leaves the edge in one move widens a column as far as a slow drag does', async ({page, context}) => {
      const slow = await tableWorlds.opened(await context.newPage(), stage, {patience: arrivalPatience});
      const flicked = await tableWorlds.opened(page, stage, {patience: arrivalPatience});
      const startingName = await measuredName(slow.resizeHandle('trades'));
      await slow.dragEdge('trades', {by: 120, moves: 20});
      const slowName = await nameOnceMoved(slow.resizeHandle('trades'), startingName);

      await flicked.dragEdge('trades', {by: 120, moves: 1});

      await expect(flicked.resizeHandle('trades')).toHaveAccessibleName(slowName);
    });

    test('after a flick, the next press on the same handle starts a new resize', async ({page}) => {
      const table = await tableWorlds.opened(page, stage, {patience: arrivalPatience});
      const startingName = await measuredName(table.resizeHandle('trades'));
      await table.dragEdge('trades', {by: 120, moves: 1});
      const flickedName = await nameOnceMoved(table.resizeHandle('trades'), startingName);

      await table.dragEdge('trades', {by: -40, moves: 5});

      await expect(table.resizeHandle('trades')).not.toHaveAccessibleName(flickedName);
    });
  });
}

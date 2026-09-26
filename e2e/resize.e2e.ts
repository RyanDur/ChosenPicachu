import {Locator, Page, expect, test} from '@playwright/test';
import {iPadUpright, iPhone, stages} from './__test_support';

const fingerOffTheLine = 21;

const widthOf = async (locator: Locator): Promise<number> => (await locator.boundingBox())?.width ?? 0;

const pressJustOffAndDrag = async (page: Page, handle: Locator, by: number): Promise<void> => {
  await handle.scrollIntoViewIfNeeded();
  const box = await handle.boundingBox();
  if (box === null) throw new Error('the handle never stood');
  const start = {x: box.x + box.width / 2 - fingerOffTheLine, y: box.y + box.height / 2};
  await page.mouse.move(start.x, start.y);
  await page.mouse.down();
  for (let step = 1; step <= 12; step++) {
    await page.mouse.move(start.x + by * step / 12, start.y);
  }
  await page.mouse.up();
};

for (const stage of stages) {
  for (const {reader, device} of [{reader: 'an iPad held upright', device: iPadUpright}, {reader: 'a phone', device: iPhone}]) {
    test.describe(`${reader}, in ${stage.name}`, () => {
      test.use(device);

      test('widens a column from a finger that lands just off its edge', async ({page}) => {
        await page.goto(stage.at);
        const table = stage.table(page);
        const trades = table.getByRole('columnheader', {name: 'trades'});
        await expect(trades).toBeVisible({timeout: 30_000});
        const before = await widthOf(trades);

        await pressJustOffAndDrag(page, table.getByRole('button', {name: /^resize trades/}), 60);

        await expect.poll(() => widthOf(trades)).toBeGreaterThan(before + 20);
      });

      test('opens the sort menu from a finger on the toggle beside the edge, and resizes nothing', async ({page}) => {
        await page.goto(stage.at);
        const table = stage.table(page);
        const trades = table.getByRole('columnheader', {name: 'trades'});
        await expect(trades).toBeVisible({timeout: 30_000});
        const before = await widthOf(trades);

        await table.getByRole('button', {name: 'sort trades'}).tap();

        await expect(table.getByLabel('sort trades by')).toBeVisible();
        expect(await widthOf(trades)).toBe(before);
      });
    });
  }
}

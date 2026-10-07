import {expect, test} from '@playwright/test';
import {iPad11Upright, iPadUpright, justPastAPhone, splitViewWide} from './__test_support';

const demos = ['Accordions', 'Z-index', 'Drag sort', 'Charts', 'Tables'];

for (const {reader, device} of [
  {reader: 'an iPad held upright', device: iPadUpright},
  {reader: 'an 11-inch iPad held upright', device: iPad11Upright},
  {reader: 'a split view wider than a phone', device: splitViewWide},
  {reader: 'a window just past a phone', device: justPastAPhone}
]) {
  test.describe(reader, () => {
    test.use(device);

    test('opens each demos tab in turn', async ({page}) => {
      await page.goto('demos/');

      for (const demo of demos) {
        await test.step(demo, async () => {
          await page.getByRole('navigation', {name: 'demos'}).getByRole('link', {name: demo}).click();
          await expect(page.getByRole('region', {name: demo, exact: true}).first()).toBeVisible();
        });
      }
    });

    test('scrolls the wide table to its last column', async ({page}) => {
      await page.goto('demos/?tab=tables');
      const table = page.getByRole('table', {name: 'Live aggregations by window'});
      await table.hover();

      await page.mouse.wheel(2000, 0);

      await expect(table.getByRole('columnheader').last()).toBeInViewport({ratio: 1});
    });
  });
}

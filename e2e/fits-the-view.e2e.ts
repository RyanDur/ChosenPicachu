import {expect} from '@playwright/test';
import {test} from './__test_support/journey';

const demos = ['Accordions', 'Z-index', 'Drag sort', 'Charts', 'Tables'];

test.describe('a width between a phone\'s and a desk\'s', {tag: ['@iPadUpright', '@iPad11Upright', '@splitViewWide', '@justPastAPhone']}, () => {
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
    await page.goto('demos/tables/');
    const table = page.getByRole('table', {name: 'Live totals by lookback'});
    await table.hover();

    await page.mouse.wheel(2000, 0);

    await expect(table.getByRole('columnheader').last()).toBeInViewport({ratio: 1});
  });
});

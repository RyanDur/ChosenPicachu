import {expect, test} from '@playwright/test';
import {designSketch, iPhone} from './__test_support';

test.use(iPhone);

test('reads all six measures in the tables tutorial’s design sketch', async ({page}) => {
  await page.goto('demos/?tab=tables');
  const sketch = designSketch(page);

  for (const measure of sketch.measures) {
    await expect(sketch.step.getByRole('columnheader', {name: measure, exact: true})).toBeVisible();
  }
  expect(await sketch.headers()).toEqual({columns: 7, rows: 5});
});

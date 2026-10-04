import {expect, test} from '@playwright/test';
import {designSketch, pageScrollsSideways} from './__test_support';

for (const width of [320, 344, 360, 390, 430, 507, 600, 820, 1440]) {
  test.describe(`a ${width}px phone`, () => {
    test.use({viewport: {width, height: 760}, hasTouch: true});

    test('reads all six measures in the tables tutorial’s design sketch, a table that fits its step, with the page held still', async ({page}) => {
      await page.goto('demos/?tab=tables');
      const sketch = designSketch(page);

      expect(await sketch.namesOverlapping()).toEqual([]);
      expect(await sketch.namesOutOfView()).toEqual([]);
      expect(await sketch.slides()).toBe(false);
      expect(await sketch.partsPastTheStep()).toEqual([]);
      expect(await pageScrollsSideways(page)).toBe(false);
      expect(await sketch.headers()).toEqual({columns: 7, rows: 5});
    });
  });
}

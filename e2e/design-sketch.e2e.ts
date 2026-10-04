import {expect, test} from '@playwright/test';
import {designSketch} from './__test_support';

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
      expect(await sketch.pageScrollsSideways()).toBe(false);
      expect(await sketch.headers()).toEqual({columns: 7, rows: 5});
    });
  });
}

for (const width of [320, 344, 390, 507, 599]) {
  test.describe(`a ${width}px phone, where the names stand on their sides`, () => {
    test.use({viewport: {width, height: 900}, hasTouch: true});

    test('stands each name over the middle of its column, with no band above them', async ({page}) => {
      await page.goto('demos/?tab=tables');
      const sketch = designSketch(page);

      expect(await sketch.namesOffTheirColumns()).toEqual([]);
      expect(await sketch.roomAboveTheNames()).toBeLessThanOrEqual(8);
    });
  });
}

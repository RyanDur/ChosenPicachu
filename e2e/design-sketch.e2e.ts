import {expect, test} from '@playwright/test';
import {designSketch} from './__test_support';

for (const width of [320, 360, 390]) {
  test.describe(`a ${width}px phone`, () => {
    test.use({viewport: {width, height: 760}, hasTouch: true});

    test('reads the six measures in the tables tutorial’s design sketch, inside its step, with the page held still', async ({page}) => {
      await page.goto('demos/?tab=tables');
      const sketch = designSketch(page);

      expect(await sketch.namesOverlapping()).toEqual([]);
      expect(await sketch.partsPastTheStep()).toEqual([]);
      expect(await sketch.pageScrollsSideways()).toBe(false);
    });
  });
}

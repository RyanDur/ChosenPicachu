import {expect, test} from '@playwright/test';
import {pageScrollsSideways, piecesPastTheirParts} from './__test_support';

for (const width of [320, 344, 360]) {
  test.describe(`a ${width}px phone`, () => {
    test.use({viewport: {width, height: 760}, hasTouch: true});

    for (const tab of ['z-index', 'dragAndDrop']) {
      test(`holds the ${tab} tab still, with every piece inside its part`, async ({page}) => {
        await page.goto(`demos/?tab=${tab}`);
        await expect(page.getByRole('code').first()).toBeVisible();

        expect(await piecesPastTheirParts(page)).toEqual([]);
        expect(await pageScrollsSideways(page)).toBe(false);
      });
    }
  });
}

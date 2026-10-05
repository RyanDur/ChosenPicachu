import {expect, test} from '@playwright/test';
import {demoSettings, dialGroups, dialGroupsLaidOutTwoWays} from './__test_support';

for (const {width, height} of [{width: 360, height: 760}, {width: 390, height: 844}, {width: 430, height: 932}, {width: 844, height: 390}]) {
  test.describe(`a ${width}×${height} screen`, () => {
    test.use({viewport: {width, height}, hasTouch: true});

    for (const {tab, inSettings} of [
      {tab: 'accordions', inSettings: false},
      {tab: 'z-index', inSettings: false},
      {tab: 'dragAndDrop', inSettings: true},
      {tab: 'tables', inSettings: true}
    ]) {
      test(`lays every dial of a group on the ${tab} tab out the same way`, async ({page}) => {
        await page.goto(`demos/?tab=${tab}`);
        const settings = demoSettings(page);
        if (inSettings && await settings.fold.getAttribute('open') === null) {
          await settings.press();
        }

        await expect.poll(async () => (await dialGroups(page)).length, {timeout: 20_000}).toBeGreaterThan(0);
        await expect.poll(() => dialGroupsLaidOutTwoWays(page), {timeout: 20_000}).toEqual([]);
      });
    }
  });
}

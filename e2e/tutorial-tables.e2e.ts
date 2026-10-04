import {expect, test} from '@playwright/test';
import {pageScrollsSideways, tutorialTable} from './__test_support';

const tables = [
  {tab: 'tables', name: 'the clues', headers: {columns: 2, rows: 5}},
  {tab: 'dragAndDrop', name: 'the clues', headers: {columns: 2, rows: 4}},
  {tab: 'tables', name: 'the layers', headers: {columns: 4, rows: 4}}
];

for (const {width, height} of [{width: 320, height: 568}, {width: 360, height: 760}, {width: 390, height: 844}, {width: 430, height: 932}, {width: 507, height: 900}, {width: 600, height: 900}]) {
  test.describe(`a ${width}px phone`, () => {
    test.use({viewport: {width, height}, hasTouch: true});

    for (const {tab, name, headers} of tables) {
      test(`reads every word of ${name} on the ${tab} tab, with nothing to slide`, async ({page}) => {
        await page.goto(`demos/?tab=${tab}`);
        const tutorial = tutorialTable(page, name);

        expect(await tutorial.wordsPastItsPart()).toEqual([]);
        expect(await tutorial.slides()).toBe(false);
        expect(await pageScrollsSideways(page)).toBe(false);
        expect(await tutorial.headers()).toEqual(headers);
      });

      test(`passes over ${name} on the ${tab} tab with the Tab key`, async ({page}) => {
        await page.goto(`demos/?tab=${tab}`);

        expect(await tutorialTable(page, name).tabLandsInside()).toBe(false);
      });
    }
  });
}

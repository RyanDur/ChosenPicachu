import {expect, test} from '@playwright/test';
import {iPhone, tutorialTable, type TutorialTableName} from './__test_support';

const tables: {tab: string; name: TutorialTableName; headers: {columns: number; rows: number}}[] = [
  {tab: 'tables', name: 'the clues', headers: {columns: 2, rows: 5}},
  {tab: 'dragAndDrop', name: 'the clues', headers: {columns: 2, rows: 4}},
  {tab: 'tables', name: 'the layers', headers: {columns: 4, rows: 4}}
];

test.describe('a phone', () => {
  test.use(iPhone);

  for (const {tab, name, headers} of tables) {
    test(`reads the headers of ${name} on the ${tab} tab`, async ({page}) => {
      await page.goto(`demos/?tab=${tab}`);
      const tutorial = tutorialTable(page, name);

      await expect(tutorial.columnHeaders).toHaveCount(headers.columns);
      await expect(tutorial.rowHeaders).toHaveCount(headers.rows);
    });

    test(`passes over ${name} on the ${tab} tab with the Tab key`, async ({page}) => {
      await page.goto(`demos/?tab=${tab}`);

      expect(await tutorialTable(page, name).tabLandsInside()).toBe(false);
    });
  }
});

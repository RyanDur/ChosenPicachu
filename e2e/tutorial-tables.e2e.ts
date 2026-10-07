import {expect, test} from '@playwright/test';
import {iPhone, tutorialTable, type TutorialTableName} from './__test_support';

const tables: {tab: string; name: TutorialTableName}[] = [
  {tab: 'tables', name: 'the clues'},
  {tab: 'dragAndDrop', name: 'the clues'},
  {tab: 'tables', name: 'the layers'}
];

test.describe('a phone', () => {
  test.use(iPhone);

  for (const {tab, name} of tables) {
    test(`passes over ${name} on the ${tab} tab with the Tab key`, async ({page}) => {
      await page.goto(`demos/?tab=${tab}`);

      expect(await tutorialTable(page, name).tabLandsInside()).toBe(false);
    });
  }
});

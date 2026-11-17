import {expect, type Page} from '@playwright/test';
import {test} from './__test_support/journey';
import {iPhone, tutorialTable, type TutorialTableName} from './__test_support';

const tabPassesOver = async (page: Page, address: string, name: TutorialTableName): Promise<void> => {
  await page.goto(address);

  expect(await tutorialTable(page, name).tabLandsInside()).toBe(false);
};

test.describe('a phone', () => {
  test.use(iPhone);

  test('passes over the clues on the need and its clues page with the Tab key', ({page}) =>
    tabPassesOver(page, 'demos/tables/the-need-and-its-clues/', 'the clues'));

  test('passes over the clues on the drag-and-drop tab with the Tab key', ({page}) => tabPassesOver(page, 'demos/drag-and-drop/', 'the clues'));

  test('passes over the features on the tables tab with the Tab key', ({page}) => tabPassesOver(page, 'demos/tables/', 'the features'));
});

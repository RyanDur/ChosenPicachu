import {expect, type Page, test} from '@playwright/test';
import {iPhone, tutorialTable, type TutorialTableName} from './__test_support';

const tabPassesOver = async (page: Page, tab: string, name: TutorialTableName): Promise<void> => {
  await page.goto(`demos/${tab}/`);

  expect(await tutorialTable(page, name).tabLandsInside()).toBe(false);
};

test.describe('a phone', () => {
  test.use(iPhone);

  test('passes over the clues on the tables tab with the Tab key', ({page}) => tabPassesOver(page, 'tables', 'the clues'));

  test('passes over the clues on the drag-and-drop tab with the Tab key', ({page}) => tabPassesOver(page, 'drag-and-drop', 'the clues'));

  test('passes over the layers on the tables tab with the Tab key', ({page}) => tabPassesOver(page, 'tables', 'the layers'));
});

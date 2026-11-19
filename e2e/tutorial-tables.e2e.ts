import {expect, type Page} from '@playwright/test';
import {test} from './__test_support/journey';
import {tutorialTable, type TutorialTableName} from './__test_support';

const tabPassesOver = async (page: Page, address: string, name: TutorialTableName): Promise<void> => {
  await page.goto(address);

  expect(await tutorialTable(page, name).tabLandsInside()).toBe(false);
};

test.describe('the Tab key', {tag: '@iPhone'}, () => {
  test('passes over the clues on the need and its clues page', ({page}) =>
    tabPassesOver(page, 'demos/tables/the-need-and-its-clues/', 'the clues'));

  test('passes over the clues on the drag-and-drop tab', ({page}) => tabPassesOver(page, 'demos/drag-and-drop/', 'the clues'));

  test('passes over the features on the tables tab', ({page}) => tabPassesOver(page, 'demos/tables/', 'the features'));
});

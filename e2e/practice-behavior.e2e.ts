import {expect, test} from '@playwright/test';
import {pillSwitch, practicePage} from './__test_support';

test('a reader who follows the tables demo link on the Behavior tab lands where both builds can be pressed', async ({page}) => {
  await page.goto('practice/behavior/');

  await practicePage(page).link('tables demo').click();

  await expect(page).toHaveURL(/\/demos\/tables\/$/);
  const world = pillSwitch(page, 'world');
  await expect(world.wordsOf('React')).toBeVisible();
  await expect(world.wordsOf('Vanilla')).toBeVisible();
});

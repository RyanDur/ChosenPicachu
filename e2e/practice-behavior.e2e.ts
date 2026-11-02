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

test('a reader who follows the Behavior tab\'s link to the elements lands on that part of the Structure tab', async ({page}) => {
  await page.goto('practice/behavior/');

  await practicePage(page).link('From the content to the element').click();

  await expect(page).toHaveURL(/\/practice\/structure\/#from-the-content-to-the-element$/);
  await expect(practicePage(page).part('From the content to the element'))
    .toHaveAttribute('id', 'from-the-content-to-the-element');
});

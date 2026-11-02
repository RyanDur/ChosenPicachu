import {expect, test} from '@playwright/test';
import {practicePage} from './__test_support';

test('a reader with the styles off meets "Where a rule lives" once, under its caption', async ({page}) => {
  const practice = practicePage(page);
  await page.goto('practice/presentation/');
  const drawing = practice.drawing(/^Where a rule lives\./);
  await expect(drawing).toBeVisible();

  await practice.readWithTheStylesOff();

  expect(await practice.drawingsShownIn(drawing)).toBe(1);
});

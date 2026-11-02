import {expect, test} from '@playwright/test';
import {practicePage} from './__test_support';

test('a reader with the styles off meets "Where a rule lives" once, under its caption', async ({page}) => {
  const practice = practicePage(page);
  await page.goto('practice/presentation/');
  const drawing = practice.figure(/^Where a rule lives\./);
  await expect(drawing).toBeVisible();

  await practice.readWithTheStylesOff();

  await expect(practice.drawingsShownIn(drawing)).toHaveCount(1);
});

test('a reader with the styles off meets the page\'s table of contents once, under its caption', async ({page}) => {
  const practice = practicePage(page);
  await page.goto('practice/structure/');
  const drawing = practice.figure(/^The page’s table of contents\./);
  await expect(drawing).toBeVisible();

  await practice.readWithTheStylesOff();

  await expect(practice.drawingsShownIn(drawing)).toHaveCount(1);
});

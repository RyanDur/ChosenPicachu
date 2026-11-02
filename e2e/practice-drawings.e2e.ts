import {expect, test} from '@playwright/test';
import {practicePage} from './__test_support';

test('a reader with the styles off meets "Where a rule lives" once, under its caption', async ({page}) => {
  const practice = practicePage(page);
  await page.goto('practice/presentation/');
  const drawing = practice.drawing(/^Where a rule lives\./);
  await expect(drawing).toBeVisible();

  await practice.readWithTheStylesOff();

  await expect(practice.drawingsShownIn(drawing)).toHaveCount(1);
});

test('a reader with the styles off meets the page\'s table of contents once, under its caption', async ({page}) => {
  const practice = practicePage(page);
  await page.goto('practice/structure/');
  const drawing = practice.drawing(/^The page’s table of contents\./);
  await expect(drawing).toBeVisible();

  await practice.readWithTheStylesOff();

  await expect(practice.drawingsShownIn(drawing)).toHaveCount(1);
});

test('a screen reader on the Behavior tab hears the one-direction drawing as its title and caption, after the carves of the code it draws', async ({page}) => {
  const practice = practicePage(page);
  await page.goto('practice/behavior/');

  const drawing = practice.drawing(/^One direction\. An event goes in, the state comes out, the page is drawn from it; the shell is outside the loop\.$/);

  await expect(drawing).toBeVisible();
  await expect(practice.drawingsHeardIn(drawing)).toHaveCount(0);
  expect(await practice.comesAfter(drawing, practice.carve(/reducer\.ts on GitHub/))).toBe(true);
});

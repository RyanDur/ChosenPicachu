import {expect, test} from '@playwright/test';
import {homePage, pressTab, recordPage, tabsTo} from './__test_support';

test('opening one fuller story closes the one that was open', async ({page}) => {
  const record = recordPage(page);
  await page.goto('record/');
  const first = record.timelineStories.nth(0);
  const second = record.timelineStories.nth(1);

  await record.fullerStoryOf(first).click();
  await expect(record.storyTold(first)).toBeVisible();

  await record.fullerStoryOf(second).click();
  await expect(record.storyTold(second)).toBeVisible();
  await expect(record.storyTold(first)).toBeHidden();
});

test('a keyboard reader who follows a line in Presentation\'s list reaches that moment on the record, and one Tab carries on inside it', async ({page}) => {
  await page.goto('');
  await tabsTo(page, homePage(page).momentLine('Presentation', '1998 The browsers need to agree'));
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/record\/#the-browsers-need-to-agree$/);
  const moment = recordPage(page).moment('The browsers need to agree');
  await expect(moment).toBeFocused();

  await pressTab(page);

  await expect(moment.getByRole('link', {name: 'the Acid Test'})).toBeFocused();
});

test('an address that names a moment inside a year of two lands on that moment, with the year\'s fold open', async ({page}) => {
  await page.goto('record/#pages-need-to-respond');
  const moment = recordPage(page).moment('Pages need to respond');

  await expect(moment.getByRole('heading', {name: 'Pages need to respond'})).toBeVisible();
  await expect(moment).toBeFocused();
});

test('a keyboard reader who follows a line in Structure\'s list to a moment inside a year of two reaches it with the year\'s fold open', async ({page}) => {
  await page.goto('');
  await tabsTo(page, homePage(page).momentLine('Structure', '1995 The browsers’ tags need a standard'));
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/record\/#the-browsers-tags-need-a-standard$/);
  const moment = recordPage(page).moment('The browsers’ tags need a standard');

  await expect(moment.getByRole('heading', {name: 'The browsers’ tags need a standard'})).toBeVisible();
  await expect(moment).toBeFocused();
});

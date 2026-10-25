import {expect, test} from '@playwright/test';
import {practicePage, pressTab, recordPage, tabsTo} from './__test_support';

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

test('a keyboard reader who follows a line in Presentation\'s story reaches that moment in the timeline, and one Tab carries on inside it', async ({page}) => {
  await page.goto('record/');
  await tabsTo(page, recordPage(page).storyLineTo('Presentation', '1998 The browsers need to agree'), {within: 200});
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/record\/#the-browsers-need-to-agree$/);
  const moment = recordPage(page).moment('The browsers need to agree');
  await expect(moment).toBeFocused();

  await pressTab(page);

  await expect(moment.getByRole('link', {name: 'The Box Acid Test'})).toBeFocused();
});

test('an address that names a moment inside a year of two lands on that moment, with the year\'s fold open', async ({page}) => {
  await page.goto('record/#pages-need-to-respond');
  const moment = recordPage(page).moment('Pages need to respond');

  await expect(moment.getByRole('heading', {name: 'Pages need to respond'})).toBeVisible();
  await expect(moment).toBeFocused();
});

test('a keyboard reader who follows a line in Structure\'s story to a moment inside a year of two reaches it with the year\'s fold open', async ({page}) => {
  await page.goto('record/');
  await tabsTo(page, recordPage(page).storyLineTo('Structure', '1995 The browsers’ tags need a standard'), {within: 200});
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/record\/#the-browsers-tags-need-a-standard$/);
  const moment = recordPage(page).moment('The browsers’ tags need a standard');

  await expect(moment.getByRole('heading', {name: 'The browsers’ tags need a standard'})).toBeVisible();
  await expect(moment).toBeFocused();
});

test('the concert\'s link to a moment inside a year of two lands on it again after the reader closes the year\'s fold', async ({page}) => {
  await page.goto('record/');
  const record = recordPage(page);
  const link = record.concertLinkTo('the 1996 moment');
  const moment = record.moment('The pages need to look the same');
  const heading = moment.getByRole('heading', {name: 'The pages need to look the same'});

  await link.click();
  await expect(heading).toBeVisible();
  await record.fullerStoryOf(record.year('1996')).click();
  await expect(heading).toBeHidden();
  await link.click();

  await expect(heading).toBeVisible();
  await expect(moment).toBeFocused();
});

test('a line in a story\'s list lands on that moment in the timeline below, with focus there', async ({page}) => {
  const record = recordPage(page);
  await page.goto('record/');

  await record.storyLineTo('Presentation', '1998 The browsers need to agree').click();

  await expect(page).toHaveURL(/\/record\/#the-browsers-need-to-agree$/);
  await expect(record.moment('The browsers need to agree')).toBeFocused();
});

test('a reader who follows a moment link on Practice lands on that moment in the record, with focus there', async ({page}) => {
  await page.goto('practice/');

  await practicePage(page).momentLink('2016 moment').click();

  await expect(page).toHaveURL(/\/record\/#the-document-needs-to-come-first$/);
  await expect(recordPage(page).moment('The document needs to come first')).toBeFocused();
});

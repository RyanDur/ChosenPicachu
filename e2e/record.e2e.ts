import {expect, Page, test} from '@playwright/test';
import {homePage, iPhone, recordPage, tabsTo} from './__test_support';

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

test.describe('a phone, where the rail sits above the page', () => {
  test.use(iPhone);

  for (const {reader, reaches, takes} of [
    {reader: 'a keyboard reader', reaches: (page: Page) => tabsTo(page, homePage(page).recordInTheRail), takes: (page: Page) => page.keyboard.press('Enter')},
    {reader: 'a finger', reaches: (page: Page) => homePage(page).recordInTheRail.scrollIntoViewIfNeeded(), takes: (page: Page) => homePage(page).recordInTheRail.tap()}
  ]) {
    test(`${reader} takes the rail's Record entry to the record's title, and Back returns to the home page`, async ({page}) => {
      await page.goto('');
      await reaches(page);
      await takes(page);
      await expect(page).toHaveURL(/\/record\/$/);
      await expect(recordPage(page).title).toBeInViewport();

      await page.goBack();

      await expect(homePage(page).opener).toBeInViewport();
    });
  }
});

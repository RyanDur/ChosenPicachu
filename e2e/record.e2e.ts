import {expect, Page, test} from '@playwright/test';
import {documentScrollY, homePage, recordPage, tabsTo} from './__test_support';

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

for (const {reader, takes} of [
  {reader: 'a keyboard reader', takes: async (page: Page) => {
    await tabsTo(page, homePage(page).linkToTheRecord);
    await page.keyboard.press('Enter');
  }},
  {reader: 'a pointer', takes: (page: Page) => homePage(page).linkToTheRecord.click()}
]) {
  test(`${reader} takes the record's door to its title, and Back returns to the door`, async ({page}) => {
    await page.goto('');
    await takes(page);
    await expect(page).toHaveURL(/\/record\/$/);
    await expect(recordPage(page).title).toBeInViewport();
    await expect.poll(() => documentScrollY(page)).toBe(0);

    await page.goBack();

    await expect(homePage(page).linkToTheRecord).toBeInViewport();
  });
}

import {expect, test} from '@playwright/test';
import {recordPage} from './__test_support';

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

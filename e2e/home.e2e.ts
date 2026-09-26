import {expect, test} from '@playwright/test';
import {homePage} from './__test_support';

test('opening one fuller story closes the one that was open', async ({page}) => {
  const home = homePage(page);
  await page.goto('');
  const first = home.timelineStories.nth(0);
  const second = home.timelineStories.nth(1);

  await home.fullerStoryOf(first).click();
  await expect(home.storyTold(first)).toBeVisible();

  await home.fullerStoryOf(second).click();
  await expect(home.storyTold(second)).toBeVisible();
  await expect(home.storyTold(first)).toBeHidden();
});

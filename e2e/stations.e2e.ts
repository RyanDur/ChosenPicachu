import {expect, test} from '@playwright/test';
import {demoSettings, pressTab, tabsTo} from './__test_support';

test('a keyboard reader who follows a story\'s station link carries on inside that station with one Tab', async ({page}) => {
  await page.goto('demos/drag-and-drop/');
  await tabsTo(page, page.getByRole('list', {name: 'the slices'}).getByRole('link', {name: 'station 4'}).first());
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#station-4$/);

  await pressTab(page);

  await expect(demoSettings(page).summary).toBeFocused();
});

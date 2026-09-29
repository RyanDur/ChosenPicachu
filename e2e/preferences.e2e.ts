import {expect, test} from '@playwright/test';
import {firstHeightAfter, heightByTheNextFrame, heightOnceSettled, phone, tablesDemo} from './__test_support';

test.use(phone);

test('a reader who asks for less motion gets the settings fold open at once', async ({page}) => {
  await page.emulateMedia({reducedMotion: 'reduce'});
  await page.goto('demos/?tab=tables');
  const tables = tablesDemo(page);
  await expect(tables.settingsFold).toBeVisible();
  await expect(tables.controls).toBeHidden();

  const closed = await heightByTheNextFrame(tables.settingsFold);
  await tables.pressSettings();
  const opened = await firstHeightAfter(tables.settingsFold, closed);

  await expect(tables.controls).toBeVisible();
  expect(await heightOnceSettled(tables.settingsFold)).toBe(opened);
});

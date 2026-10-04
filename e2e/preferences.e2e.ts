import {expect, test} from '@playwright/test';
import {demoSettings, firstHeightAfter, heightByTheNextFrame, heightOnceSettled, phone, tablesDemo} from './__test_support';

test.use(phone);

test('a reader who asks for less motion gets the settings fold open at once', async ({page}) => {
  await page.emulateMedia({reducedMotion: 'reduce'});
  await page.goto('demos/?tab=tables');
  const settings = demoSettings(page);
  const tables = tablesDemo(page);
  await expect(settings.fold).toBeVisible();
  await expect(tables.controls).toBeHidden();

  const closed = await heightByTheNextFrame(settings.fold);
  const opening = firstHeightAfter(settings.fold, closed);
  await settings.press();
  const opened = await opening;

  await expect(tables.controls).toBeVisible();
  expect(await heightOnceSettled(settings.fold)).toBe(opened);
});

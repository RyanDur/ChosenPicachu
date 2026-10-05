import {expect, test} from '@playwright/test';
import {demoSettings, phone, tablesDemo} from './__test_support';

test.use(phone);

test('a reader on a phone opens the settings fold and reaches the table\'s controls', async ({page}) => {
  await page.goto('demos/?tab=tables');
  const settings = demoSettings(page);
  const tables = tablesDemo(page);
  await expect(settings.fold).toBeVisible();
  await expect(tables.controls).toBeHidden();

  await settings.press();

  await expect(tables.controls).toBeVisible();
});

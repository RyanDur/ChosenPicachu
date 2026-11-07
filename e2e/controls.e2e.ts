import {expect} from '@playwright/test';
import {test} from './__test_support/journey';
import {demoSettings, desktop, phone, tablesDemo} from './__test_support';

test.describe('a desktop', () => {
  test.use(desktop);

  test('the settings a reader left open stay open when the window is made narrow', async ({page}) => {
    const tables = tablesDemo(page);
    await page.goto('demos/tables/sort/');
    await demoSettings(page).press();
    await expect(tables.controls).toBeVisible();

    await page.setViewportSize(phone.viewport);

    await expect(tables.controls).toBeVisible();
  });
});

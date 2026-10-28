import {expect, test} from '@playwright/test';
import {demoSettings, desktop, phone, phoneSideways, tablesDemo} from './__test_support';

for (const {reader, device} of [{reader: 'a phone', device: phone}, {reader: 'a phone held sideways', device: phoneSideways}]) {
  test.describe(reader, () => {
    test.use(device);

    test('starts the table controls closed', async ({page}) => {
      const tables = tablesDemo(page);
      await page.goto('demos/tables/');

      await expect(demoSettings(page).fold).toBeVisible();
      await expect(tables.controls).toBeHidden();
    });
  });
}

test.describe('a desktop', () => {
  test.use(desktop);

  test('starts the table controls closed, and one press opens them', async ({page}) => {
    const tables = tablesDemo(page);
    await page.goto('demos/tables/');
    await expect(tables.controls).toBeHidden();

    await demoSettings(page).press();

    await expect(tables.controls).toBeVisible();
  });

  test('the settings a reader left open stay open when the window is made narrow', async ({page}) => {
    const tables = tablesDemo(page);
    await page.goto('demos/tables/');
    await demoSettings(page).press();
    await expect(tables.controls).toBeVisible();

    await page.setViewportSize(phone.viewport);

    await expect(tables.controls).toBeVisible();
  });
});

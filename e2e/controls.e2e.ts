import {expect, test} from '@playwright/test';
import {desktop, phone, phoneSideways, tablesDemo} from './__test_support';

for (const {reader, device} of [{reader: 'a phone', device: phone}, {reader: 'a phone held sideways', device: phoneSideways}]) {
  test.describe(reader, () => {
    test.use(device);

    test('starts the table controls closed', async ({page}) => {
      const tables = tablesDemo(page);
      await page.goto('demos/?tab=tables');

      await expect(tables.settingsFold).toBeVisible();
      await expect(tables.controls).toBeHidden();
    });
  });
}

test.describe('a desktop', () => {
  test.use(desktop);

  test('starts the table controls open', async ({page}) => {
    await page.goto('demos/?tab=tables');

    await expect(tablesDemo(page).controls).toBeVisible();
  });
});

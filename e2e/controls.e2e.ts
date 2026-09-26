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

  test('the settings a reader closed stay closed while the table keeps updating', async ({page}) => {
    const tables = tablesDemo(page);
    await page.goto('demos/?tab=tables');
    await expect(tables.controls).toBeVisible();
    await tables.pressSettings();
    await expect(tables.controls).toBeHidden();

    const trades = page.getByRole('region', {name: 'live aggregations'}).getByRole('cell').nth(1);
    await expect(trades).not.toHaveText(await trades.innerText(), {timeout: 10_000});

    await expect(tables.controls).toBeHidden();
  });

  test('the settings a reader left open stay open when the window is made narrow', async ({page}) => {
    const tables = tablesDemo(page);
    await page.goto('demos/?tab=tables');
    await expect(tables.controls).toBeVisible();

    await page.setViewportSize(phone.viewport);

    await expect(tables.controls).toBeVisible();
  });
});

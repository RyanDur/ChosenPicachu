import {expect, test} from '@playwright/test';
import {desktop, phone, phoneSideways} from './__test_support';

for (const {reader, device} of [{reader: 'a phone', device: phone}, {reader: 'a phone held sideways', device: phoneSideways}]) {
  test.describe(reader, () => {
    test.use(device);

    test('starts the table controls closed', async ({page}) => {
      await page.goto('demos/?tab=tables');

      await expect(page.getByRole('group', {name: 'settings'}).first()).toBeVisible();
      await expect(page.getByRole('region', {name: 'table controls'})).toBeHidden();
    });
  });
}

test.describe('a desktop', () => {
  test.use(desktop);

  test('starts the table controls open', async ({page}) => {
    await page.goto('demos/?tab=tables');

    await expect(page.getByRole('region', {name: 'table controls'})).toBeVisible();
  });
});

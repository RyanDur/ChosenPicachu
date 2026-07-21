import {expect, test} from '@playwright/test';

const tabs = ['aic', 'harvard', 'vam'];

for (const tab of tabs) {
  test(`the ${tab} gallery hangs art from the real museum`, async ({page}) => {
    await page.goto(`gallery?page=1&size=8&tab=${tab}`);

    await expect(page.locator('figure.frame')).toHaveCount(8, {timeout: 30_000});
    await expect(page.getByTestId('empty-gallery')).toHaveCount(0);
    await expect(page.locator('figure.frame figcaption').first()).not.toBeEmpty();
  });
}

test('an aic search still hangs art', async ({page}) => {
  await page.goto('gallery?page=1&size=8&tab=aic&search=monet');

  await expect(page.locator('figure.frame')).toHaveCount(8, {timeout: 30_000});
  await expect(page.getByTestId('empty-gallery')).toHaveCount(0);
});

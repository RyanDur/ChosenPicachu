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

test('vam art truly renders and opens into a piece', async ({page}) => {
  await page.goto(`gallery?page=1&size=8&tab=vam`);
  const painting = page.locator('figure.frame a img.image:not(.off-screen)').first();
  await expect(painting).toBeVisible({timeout: 30_000});

  await painting.click();

  await expect(page).toHaveURL(/gallery\/[A-Za-z]*\d+/);
  await expect(page.getByTestId('image-figure')).toBeVisible({timeout: 30_000});
});

test('an aic search still hangs art', async ({page}) => {
  await page.goto('gallery?page=1&size=8&tab=aic&search=monet');

  await expect(page.locator('figure.frame')).toHaveCount(8, {timeout: 30_000});
  await expect(page.getByTestId('empty-gallery')).toHaveCount(0);
});

test('searching the aic through the ui filters the wall', async ({page}) => {
  await page.goto(`gallery?page=1&size=8&tab=aic`);
  await expect(page.locator('figure.frame')).toHaveCount(8, {timeout: 30_000});

  await page.locator('#query').fill('monet');
  await page.getByTestId('submit-query').click();

  await expect(page).toHaveURL(/search=monet/);
  await expect(page.locator('figure.frame')).toHaveCount(8, {timeout: 30_000});
});

test('a piece page presents its artwork data', async ({page}) => {
  await page.goto(`gallery/27992?tab=aic`);

  await expect(page.locator('#app-header')).toContainText('La Grande Jatte', {timeout: 30_000});
});

test('the users page presents the form and the seeded table', async ({page}) => {
  await page.goto(`users`);

  await expect(page.getByLabel('First Name')).toBeVisible({timeout: 15_000});
  await expect(page.getByTestId('table')).toBeVisible();
});

import {expect, test} from '@playwright/test';

test('every door the gallery offers hangs art from its museum', async ({page}) => {
  await page.goto('gallery?page=1&size=8');
  const doors = page.getByRole('navigation', {name: 'museums'}).getByRole('link');
  await expect(doors.first()).toBeVisible({timeout: 30_000});

  const offered = await doors.count();
  expect(offered).toBeGreaterThan(0);
  for (let door = 0; door < offered; door += 1) {
    await doors.nth(door).click();

    await expect(page.getByRole('figure')).toHaveCount(8, {timeout: 30_000});
    await expect(page.getByAltText('empty gallery')).toHaveCount(0);
    await expect(page.getByRole('figure').first()).not.toBeEmpty();
  }
});

test('vam art truly renders and opens into a piece', async ({page}) => {
  await page.goto(`gallery?page=1&size=8&tab=vam`);
  const painting = page.getByRole('figure').first().getByRole('link').first();
  await expect(painting).toBeVisible({timeout: 30_000});

  await painting.click();

  await expect(page).toHaveURL(/gallery\/[A-Za-z]*\d+/);
  await expect(page.getByRole('figure')).toBeVisible({timeout: 30_000});
});

test('a search still hangs art', async ({page}) => {
  await page.goto('gallery?page=1&size=8&search=monet');

  await expect(page.getByRole('figure')).toHaveCount(8, {timeout: 30_000});
  await expect(page.getByAltText('empty gallery')).toHaveCount(0);
});

test('searching through the ui filters the wall', async ({page}) => {
  await page.goto('gallery?page=1&size=8');
  await expect(page.getByRole('figure')).toHaveCount(8, {timeout: 30_000});

  await page.getByLabel(/Search For/).fill('monet');
  await page.getByRole('button', {name: 'submit search'}).click();

  await expect(page).toHaveURL(/search=monet/);
  await expect(page.getByRole('figure')).toHaveCount(8, {timeout: 30_000});
});

test('a piece page presents its artwork data', async ({page}) => {
  await page.goto(`gallery/27992?tab=aic`);

  await expect(page.getByRole('banner')).toContainText('La Grande Jatte', {timeout: 30_000});
});

test('the users page presents the form and the seeded table', async ({page}) => {
  await page.goto(`users`);

  await expect(page.getByLabel('First Name')).toBeVisible({timeout: 15_000});
  await expect(page.getByRole('table')).toBeVisible();
});

for (const entry of ['users', 'demos', 'games', 'gallery']) {
  test(`arriving directly at ${entry} is a real 200, not a fallback`, async ({page}) => {
    const response = await page.goto(entry);

    expect(response?.status()).toBe(200);
    await expect(page.getByRole('navigation').first()).toBeVisible({timeout: 30_000});
  });
}

import {expect, test} from '@playwright/test';
import {doors, emptyWall, firstPainting, searchFor, wall} from './__test_support';

test('every door the gallery offers hangs art from its museum', async ({page}) => {
  await page.goto('gallery?page=1&size=8');
  await expect(doors(page).first()).toBeVisible({timeout: 30_000});

  const offered = await doors(page).count();
  expect(offered).toBeGreaterThan(0);
  for (let door = 0; door < offered; door += 1) {
    await doors(page).nth(door).click();

    await expect(wall(page)).toHaveCount(8, {timeout: 30_000});
    await expect(emptyWall(page)).toHaveCount(0);
    await expect(wall(page).first()).not.toBeEmpty();
  }
});

test('vam art truly renders and opens into a piece', async ({page}) => {
  await page.goto(`gallery?page=1&size=8&tab=vam`);
  await expect(firstPainting(page)).toBeVisible({timeout: 30_000});

  await firstPainting(page).click();

  await expect(page).toHaveURL(/gallery\/[A-Za-z]*\d+/);
  await expect(wall(page)).toBeVisible({timeout: 30_000});
});

test('a search still hangs art', async ({page}) => {
  await page.goto('gallery?page=1&size=8&search=monet');

  await expect(wall(page)).toHaveCount(8, {timeout: 30_000});
  await expect(emptyWall(page)).toHaveCount(0);
});

test('searching through the ui filters the wall', async ({page}) => {
  await page.goto('gallery?page=1&size=8');
  await expect(wall(page)).toHaveCount(8, {timeout: 30_000});

  await searchFor(page, 'monet');

  await expect(page).toHaveURL(/search=monet/);
  await expect(wall(page)).toHaveCount(8, {timeout: 30_000});
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

import {expect, test} from '@playwright/test';
import {galleryPage} from './__test_support';

test('every door the gallery offers hangs art from its museum', async ({page}) => {
  const gallery = galleryPage(page);
  await page.goto('gallery?page=1&size=8');
  await expect(gallery.doors.first()).toBeVisible({timeout: 30_000});

  const offered = await gallery.doors.count();
  expect(offered).toBeGreaterThan(0);
  for (let door = 0; door < offered; door += 1) {
    await gallery.doors.nth(door).click();

    await expect(gallery.wall).toHaveCount(8, {timeout: 30_000});
    await expect(gallery.emptyWall).toHaveCount(0);
    await expect(gallery.wall.first()).not.toBeEmpty();
  }
});

test('the V&A wall hangs its art', async ({page}) => {
  const gallery = galleryPage(page);
  await page.goto('gallery?page=1&size=8&tab=vam');

  await expect(gallery.firstPainting).toBeVisible({timeout: 30_000});
});

test('a piece on the V&A wall opens into its own page', async ({page}) => {
  const gallery = galleryPage(page);
  await page.goto('gallery?page=1&size=8&tab=vam');
  await expect(gallery.firstPainting).toBeVisible({timeout: 30_000});

  await gallery.firstPainting.click();

  await expect(page).toHaveURL(/gallery\/[A-Za-z]*\d+/);
  await expect(gallery.wall).toBeVisible({timeout: 30_000});
});

test('a search still hangs art', async ({page}) => {
  const gallery = galleryPage(page);
  await page.goto('gallery?page=1&size=8&search=monet');

  await expect(gallery.wall).toHaveCount(8, {timeout: 30_000});
  await expect(gallery.emptyWall).toHaveCount(0);
});

test('a search typed into the box lands in the address and the wall stays hung', async ({page}) => {
  const gallery = galleryPage(page);
  await page.goto('gallery?page=1&size=8');
  await expect(gallery.wall).toHaveCount(8, {timeout: 30_000});

  await gallery.searchFor('monet');

  await expect(page).toHaveURL(/search=monet/);
  await expect(gallery.wall).toHaveCount(8, {timeout: 30_000});
});

test('a piece page names the artwork it shows', async ({page}) => {
  await page.goto('gallery/27992?tab=aic');

  await expect(page.getByRole('banner')).toContainText('La Grande Jatte', {timeout: 30_000});
});

test('the users page opens with somewhere to add a person and the people already there', async ({page}) => {
  await page.goto('users');

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

import {expect, test} from '@playwright/test';
import {galleryPage, phone} from './__test_support';

test.use(phone);

test('following a link lands at the top of the next page', async ({page}) => {
  await page.goto('');

  await page.getByRole('link', {name: 'Start where the demos start'}).click();
  await expect(page.getByRole('navigation', {name: 'demos'})).toBeVisible();

  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
});

test('the header and nav keep their height while the gallery wall is still on its way', async ({page}) => {
  let hang = (): void => undefined;
  const held = new Promise<void>(resolve => {
    hang = resolve;
  });
  await page.route('**/vam/objects/search**', async route => {
    await held;
    await route.continue();
  });
  const header = page.getByRole('banner');
  const nav = page.getByRole('navigation', {name: 'site'});

  await page.goto('gallery?page=1&size=8&tab=vam');
  await expect(page.getByRole('progressbar', {name: 'loading gallery'})).toBeVisible();
  await expect(header).toBeVisible();
  await expect(nav).toBeVisible();
  const headerWhileLoading = await header.boundingBox();
  const navWhileLoading = await nav.boundingBox();

  hang();

  await expect(galleryPage(page).wall.first()).toBeVisible({timeout: 30_000});
  expect(await header.boundingBox()).toEqual(headerWhileLoading);
  expect(await nav.boundingBox()).toEqual(navWhileLoading);
});

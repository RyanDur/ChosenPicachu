import {expect, test} from '@playwright/test';
import {galleryPage, looks} from './__test_support';

test('on a phone the rail and its list of paths wear the same field', async ({page}) => {
  await page.setViewportSize({width: 412, height: 823});
  await page.goto('');
  const rail = page.getByRole('navigation', {name: 'site'});
  const field = await looks(page).resolved('background-color', '--field');

  await expect(rail).toHaveCSS('background-color', field);
  await expect(rail.getByRole('list')).toHaveCSS('background-color', field);
});

test('the header and nav keep their height while the gallery wall is still on its way', async ({page}) => {
  await page.setViewportSize({width: 412, height: 823});
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

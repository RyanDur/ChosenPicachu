import {expect, test} from '@playwright/test';
import {wall} from './__test_support';

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

  await expect(wall(page).first()).toBeVisible({timeout: 30_000});
  expect(await header.boundingBox()).toEqual(headerWhileLoading);
  expect(await nav.boundingBox()).toEqual(navWhileLoading);
});

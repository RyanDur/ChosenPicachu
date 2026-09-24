import {expect, test} from '@playwright/test';
import {galleryPage, looks} from './__test_support';

test('on a phone the list of paths wears no surface of its own, and the rail shows through', async ({page}) => {
  await page.setViewportSize({width: 412, height: 823});
  await page.goto('');
  const rail = page.getByRole('navigation', {name: 'site'});

  await expect(rail).toHaveCSS('background-color', await looks(page).resolved('background-color', '--field'));
  await expect(rail.getByRole('list')).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
});

test('on a landscape phone the tab strip keeps to the short bar', async ({page}) => {
  await page.setViewportSize({width: 844, height: 390});
  await page.goto('demos/?tab=accordions');
  const strip = page.getByRole('navigation', {name: 'demos'}).getByRole('list');

  await expect(strip).toBeVisible();
  await expect(strip).toHaveCSS('height', await looks(page).resolved('min-height', '--base-x-5_5'));
});

test('following a link on a phone lands at the top of the next page', async ({page}) => {
  await page.setViewportSize({width: 412, height: 823});
  await page.goto('');

  await page.getByRole('link', {name: 'Start where the demos start'}).click();
  await expect(page.getByRole('navigation', {name: 'demos'})).toBeVisible();

  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
});

test('going back on a phone lands where the reader left', async ({page}) => {
  await page.setViewportSize({width: 412, height: 823});
  await page.goto('');
  const away = page.getByRole('link', {name: 'Start where the demos start'});
  await away.scrollIntoViewIfNeeded();
  const left = await page.evaluate(() => window.scrollY);
  expect(left).toBeGreaterThan(0);

  await away.click();
  await expect(page.getByRole('navigation', {name: 'demos'})).toBeVisible();
  await page.goBack();

  await expect(page.getByRole('link', {name: 'Start where the demos start'})).toBeVisible();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(left);
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

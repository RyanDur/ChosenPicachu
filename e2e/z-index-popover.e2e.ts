import {expect, test} from '@playwright/test';
import {desktop, iPhone, topLayerMenu, trappedMenu} from './__test_support';

for (const {size, device} of [{size: 390, device: iPhone}, {size: 1440, device: desktop}]) {
  test.describe(`at ${size} wide`, () => {
    test.use(device);

    for (const state of ['contained', 'free']) {
      test(`the menu in the top layer opens over card two with card one ${state}`, async ({page}) => {
        await page.goto(`demos/?tab=z-index&card-one=${state}`);
        const menu = topLayerMenu(page);

        await menu.open();

        await expect(menu.menu).toBeVisible();
        await expect.poll(() => menu.overlapsCardTwo()).toBe(true);
        for (const choice of ['name', 'date', 'size'] as const) {
          await expect.poll(() => menu.onTopAt(choice), choice).toBe(true);
        }
      });
    }
  });
}

test('Escape from a choice closes the menu in the top layer and gives focus back to its button', async ({page}) => {
  await page.goto('demos/?tab=z-index');
  const menu = topLayerMenu(page);
  await menu.sortBy.focus();
  await page.keyboard.press('Enter');
  await page.keyboard.press('Tab');
  await expect(menu.choice('name')).toBeFocused();

  await page.keyboard.press('Escape');

  await expect(menu.menu).toBeHidden();
  await expect(menu.sortBy).toBeFocused();
});

test('a click outside closes the menu in the top layer', async ({page}) => {
  await page.goto('demos/?tab=z-index');
  const menu = topLayerMenu(page);
  await menu.open();
  await expect(menu.menu).toBeVisible();

  await trappedMenu(page).caption.click();

  await expect(menu.menu).toBeHidden();
});

test('a choice closes the menu in the top layer', async ({page}) => {
  await page.goto('demos/?tab=z-index');
  const menu = topLayerMenu(page);
  await menu.open();

  await menu.choice('date').click();

  await expect(menu.menu).toBeHidden();
});

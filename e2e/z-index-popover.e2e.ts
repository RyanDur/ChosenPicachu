import {expect, test} from '@playwright/test';
import {desktop, iPhone, topLayerMenu, trappedMenu} from './__test_support';

const overEverything = 'The list opened over everything around it. It is in the top layer, which the browser draws above the whole page, so no z-index is compared with it.';

for (const {size, device} of [{size: 390, device: iPhone}, {size: 1440, device: desktop}]) {
  test.describe(`at ${size} wide`, () => {
    test.use(device);

    for (const state of ['contained', 'free']) {
      test(`the menu in the top layer opens over everything around it with card one ${state}, and the exhibit says so`, async ({page}) => {
        await page.goto(`demos/?tab=z-index&card-one=${state}`);
        const menu = topLayerMenu(page);

        await menu.open();

        await expect(menu.menu).toBeVisible();
        for (const choice of ['name', 'date', 'size'] as const) {
          await expect.poll(() => menu.onTopAt(choice), choice).toBe(true);
        }
        await expect(trappedMenu(page).said).toHaveText(overEverything);
      });
    }
  });
}

test.describe('a phone', () => {
  test.use(iPhone);

  test('the menu in the top layer, pressed at the bottom edge of the view, is said to open over everything around it', async ({page}) => {
    await page.goto('demos/?tab=z-index');
    const menu = topLayerMenu(page);

    await menu.openFromTheBottomEdge();

    await expect(menu.menu).toBeVisible();
    await expect(trappedMenu(page).said).toHaveText(overEverything);
  });
});

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

test('Tab from Sort by reaches Sort by, in the top layer', async ({page}) => {
  await page.goto('demos/?tab=z-index');
  const menu = topLayerMenu(page);
  await trappedMenu(page).sortBy.focus();

  await page.keyboard.press('Tab');

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

test('a choice closes the menu in the top layer, and its button names the choice', async ({page}) => {
  await page.goto('demos/?tab=z-index');
  const menu = topLayerMenu(page);
  await menu.open();

  await menu.choice('date').click();

  await expect(menu.menu).toBeHidden();
  await expect(menu.sortBy).toHaveAccessibleName('Sort by: date, in the top layer');
});

test('reopened, the menu in the top layer marks the choice it was given', async ({page}) => {
  await page.goto('demos/?tab=z-index');
  const menu = topLayerMenu(page);
  await menu.open();
  await menu.choice('date').click();

  await menu.open();

  await expect(menu.choice('date')).toHaveAttribute('aria-current', 'true');
  await expect(menu.choice('name')).not.toHaveAttribute('aria-current', 'true');
});

import {expect, type Page, test} from '@playwright/test';
import {desktop, iPhone, topLayerMenu, trappedMenu} from './__test_support';

const overEverything = 'The list opened over everything around it. It is in the top layer, which the browser draws above the whole page, so no z-index is compared with it.';

const theTopLayerMenuIsOverEverything = async (page: Page): Promise<void> => {
  const menu = topLayerMenu(page);
  await expect(menu.menu).toBeVisible();
  await expect.poll(() => menu.onTopAt('name'), 'name').toBe(true);
  await expect.poll(() => menu.onTopAt('date'), 'date').toBe(true);
  await expect.poll(() => menu.onTopAt('size'), 'size').toBe(true);
  await expect(trappedMenu(page).said).toHaveText(overEverything);
};

const opensOverEverythingWithCardOne = async (page: Page, state: 'contained' | 'free'): Promise<void> => {
  await page.goto(`demos/z-index/?card-one=${state}`);
  const menu = topLayerMenu(page);

  await menu.open();

  await theTopLayerMenuIsOverEverything(page);
};

for (const {size, device} of [{size: 390, device: iPhone}, {size: 1440, device: desktop}]) {
  test.describe(`at ${size} wide`, () => {
    test.use(device);

    test('the menu in the top layer opens over everything around it with card one contained, and the exhibit says so', ({page}) =>
      opensOverEverythingWithCardOne(page, 'contained'));

    test('the menu in the top layer opens over everything around it with card one free, and the exhibit says so', ({page}) =>
      opensOverEverythingWithCardOne(page, 'free'));
  });
}

test.describe('a phone', () => {
  test.use(iPhone);

  test('the menu in the top layer, pressed at the bottom edge of the view, opens over everything around it, and the exhibit says so', async ({page}) => {
    await page.goto('demos/z-index/');
    const menu = topLayerMenu(page);

    await menu.openFromTheBottomEdge();

    await theTopLayerMenuIsOverEverything(page);
  });
});

test('Escape from a choice closes the menu in the top layer and gives focus back to its button', async ({page}) => {
  await page.goto('demos/z-index/');
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
  await page.goto('demos/z-index/');
  const menu = topLayerMenu(page);
  await trappedMenu(page).sortBy.focus();

  await page.keyboard.press('Tab');

  await expect(menu.sortBy).toBeFocused();
});

test('a click outside closes the menu in the top layer', async ({page}) => {
  await page.goto('demos/z-index/');
  const menu = topLayerMenu(page);
  await menu.open();
  await expect(menu.menu).toBeVisible();

  await trappedMenu(page).caption.click();

  await expect(menu.menu).toBeHidden();
});

test('a choice closes the menu in the top layer, and its button names the choice', async ({page}) => {
  await page.goto('demos/z-index/');
  const menu = topLayerMenu(page);
  await menu.open();

  await menu.choice('date').click();

  await expect(menu.menu).toBeHidden();
  await expect(menu.sortBy).toHaveAccessibleName('Sort by: date, in the top layer');
});

test('reopened, the menu in the top layer marks the choice it was given', async ({page}) => {
  await page.goto('demos/z-index/');
  const menu = topLayerMenu(page);
  await menu.open();
  await menu.choice('date').click();

  await menu.open();

  await expect(menu.choice('date')).toHaveAttribute('aria-current', 'true');
  await expect(menu.choice('name')).not.toHaveAttribute('aria-current', 'true');
});

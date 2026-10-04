import {expect, test} from '@playwright/test';
import {desktop, iPhone, trappedMenu} from './__test_support';

for (const {size, device} of [{size: 390, device: iPhone}, {size: 1440, device: desktop}]) {
  test.describe(`at ${size} wide`, () => {
    test.use(device);

    test('the menu opens under card two, with its first choice in the gap above it and its last below it', async ({page}) => {
      await page.goto('demos/?tab=z-index');
      const menu = trappedMenu(page);

      await menu.open();

      await expect.poll(() => menu.onTopAt('name')).toBe('the choice');
      await expect.poll(() => menu.onTopAt('date')).toBe('card two');
      await expect.poll(() => menu.onTopAt('size')).toBe('the choice');
    });

    for (const state of ['contained', 'free']) {
      test(`the open menu ends above the sentence that says where it opened, with card one ${state}`, async ({page}) => {
        await page.goto(`demos/?tab=z-index&card-one=${state}`);
        const menu = trappedMenu(page);

        await menu.open();

        await expect(menu.said).not.toBeEmpty();
        const [list, said] = await Promise.all([page.getByRole('menu').boundingBox(), menu.said.boundingBox()]);
        expect((list?.y ?? Infinity) + (list?.height ?? 0)).toBeLessThanOrEqual(said?.y ?? 0);
      });
    }

    test('freeing card one opens the menu over card two, and trapping it again drops the menu back under', async ({page}) => {
      await page.goto('demos/?tab=z-index');
      const menu = trappedMenu(page);

      await menu.contextChoice.click();
      await expect(menu.contextChoice).not.toBeChecked();
      await menu.open();
      await expect.poll(() => menu.onTopAt('date')).toBe('the choice');
      await page.keyboard.press('Escape');

      await menu.contextChoice.click();
      await expect(menu.contextChoice).toBeChecked();
      await menu.open();
      await expect.poll(() => menu.onTopAt('date')).toBe('card two');
    });
  });
}

test('going back past the box takes back the sentence, which no longer matches the cards', async ({page}) => {
  await page.goto('demos/?tab=z-index');
  const menu = trappedMenu(page);
  await menu.contextChoice.click();
  await menu.open();
  await expect(menu.said).toContainText('over card two');
  await page.keyboard.press('Escape');

  await page.goBack();

  await expect(menu.contextChoice).toBeChecked();
  await expect(menu.said).toBeEmpty();
});

test('a choice in the gap takes a click, and the menu names it', async ({page}) => {
  await page.goto('demos/?tab=z-index');
  const menu = trappedMenu(page);
  await menu.open();

  await menu.choice('name').click();

  await expect(page.getByRole('button', {name: 'Sort by: name, the old way'})).toBeFocused();
});

test('the keyboard moves through the trapped menu, to a choice under card two', async ({page}) => {
  await page.goto('demos/?tab=z-index');
  const menu = trappedMenu(page);

  await menu.openByKeyboard();
  await page.keyboard.press('ArrowDown');

  await expect(menu.choice('date')).toBeFocused();
  await expect.poll(() => menu.onTopAt('date')).toBe('card two');
});

test('pressing Sort by again closes its menu', async ({page}) => {
  await page.goto('demos/?tab=z-index');
  const menu = trappedMenu(page);
  await menu.open();
  await expect(page.getByRole('menu')).toBeVisible();

  await menu.sortBy.click();

  await expect(page.getByRole('menu')).toHaveCount(0);
  await expect(menu.sortBy).toBeFocused();
});

test('Shift+Tab from a choice closes the menu, wherever focus lands', async ({page}) => {
  await page.goto('demos/?tab=z-index');
  const menu = trappedMenu(page);
  await menu.openByKeyboard();
  await expect(menu.choice('name')).toBeFocused();

  await page.keyboard.press('Shift+Tab');

  await expect(page.getByRole('menu')).toHaveCount(0);
  await expect(menu.sortBy).toHaveAttribute('aria-expanded', 'false');
});

test('a press outside the open menu closes it', async ({page}) => {
  await page.goto('demos/?tab=z-index');
  const menu = trappedMenu(page);
  await menu.open();
  await expect(page.getByRole('menu')).toBeVisible();

  await menu.caption.click();

  await expect(page.getByRole('menu')).toHaveCount(0);
});

test('a choice looks different under the pointer and in keyboard focus than at rest', async ({page}) => {
  await page.goto('demos/?tab=z-index&card-one=free');
  const menu = trappedMenu(page);
  await menu.openByKeyboard();
  const date = menu.choice('date');
  const atRest = await date.screenshot({animations: 'disabled'});

  await page.keyboard.press('ArrowDown');
  const focused = await date.screenshot({animations: 'disabled'});
  await page.keyboard.press('ArrowDown');
  await date.hover();
  const pointedAt = await date.screenshot({animations: 'disabled'});

  expect(focused.equals(atRest)).toBe(false);
  expect(pointedAt.equals(atRest)).toBe(false);
});

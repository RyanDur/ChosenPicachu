import {expect, test} from '@playwright/test';
import {desktop, iPhone, trappedMenu} from './__test_support';

const contained = 'Card one forms a stacking context. Its menu opens under card two.';
const free = 'Card one forms no stacking context. Its menu opens over card two.';

for (const {size, device} of [{size: 390, device: iPhone}, {size: 1440, device: desktop}]) {
  test.describe(`at ${size} wide`, () => {
    test.use(device);

    test('the menu opens under card two, with its first choice showing in the gap above it', async ({page}) => {
      await page.goto('demos/?tab=z-index');
      const menu = trappedMenu(page);

      await menu.open();

      await expect.poll(() => menu.onTopAt('name')).toBe('the choice');
      await expect.poll(() => menu.onTopAt('date')).toBe('card two');
    });

    for (const state of ['contained', 'free']) {
      test(`the open menu ends above the caption, with card one ${state}`, async ({page}) => {
        await page.goto(`demos/?tab=z-index&card-one=${state}`);
        const menu = trappedMenu(page);

        await menu.open();

        const [list, caption] = await Promise.all([page.getByRole('menu').boundingBox(), menu.caption.boundingBox()]);
        expect((list?.y ?? Infinity) + (list?.height ?? 0)).toBeLessThanOrEqual(caption?.y ?? 0);
      });
    }

    test('freeing card one opens the menu over card two, and trapping it again drops the menu back under, each said', async ({page}) => {
      await page.goto('demos/?tab=z-index');
      const menu = trappedMenu(page);

      await menu.contextChoice.click();
      await expect(menu.contextChoice).not.toBeChecked();
      await expect(menu.says).toHaveText(free);
      await menu.open();
      await expect.poll(() => menu.onTopAt('date')).toBe('the choice');
      await page.keyboard.press('Escape');

      await menu.contextChoice.click();
      await expect(menu.contextChoice).toBeChecked();
      await expect(menu.says).toHaveText(contained);
      await menu.open();
      await expect.poll(() => menu.onTopAt('date')).toBe('card two');
    });
  });
}

test('a choice in the gap takes a click, and the menu names it', async ({page}) => {
  await page.goto('demos/?tab=z-index');
  const menu = trappedMenu(page);
  await menu.open();

  await menu.choice('name').click();

  await expect(page.getByRole('button', {name: 'Sort by: name'})).toBeFocused();
});

test('the keyboard moves through the trapped menu, to a choice under card two, and Escape gives focus back', async ({page}) => {
  await page.goto('demos/?tab=z-index');
  const menu = trappedMenu(page);

  await menu.openByKeyboard();
  await page.keyboard.press('ArrowDown');

  await expect(menu.choice('date')).toBeFocused();
  await expect.poll(() => menu.onTopAt('date')).toBe('card two');
  await page.keyboard.press('Escape');
  await expect(menu.sortBy).toBeFocused();
});

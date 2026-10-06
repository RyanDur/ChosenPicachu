import {expect, test} from '@playwright/test';
import {countScriptScrolls, desktop, iPhone, paneScrollTop} from './__test_support';

for (const [frame, device] of [['a phone', iPhone], ['a desk', desktop]] as const) {
  test.describe(frame, () => {
    test.use(device);

    test('Back to a tutorial from another tab, and Forward again, leave the scroll to the browser', async ({page}) => {
      const scriptScrolls = await countScriptScrolls(page);
      await page.goto('demos/?tab=tables#station-5');
      await expect(page.getByRole('heading', {name: 'Slice the design into stories'})).toBeVisible();
      await page.getByRole('navigation', {name: 'demos'}).getByRole('link', {name: 'Z-index'}).click();
      await expect(page.getByRole('heading', {name: 'Why Third is on top'})).toBeAttached();
      const beforeBack = await scriptScrolls();

      await page.goBack();

      await expect(page.getByRole('heading', {name: 'Slice the design into stories'})).toBeAttached();
      expect(await scriptScrolls()).toBe(beforeBack);

      await page.goForward();

      await expect(page.getByRole('heading', {name: 'Why Third is on top'})).toBeAttached();
      expect(await scriptScrolls()).toBe(beforeBack);
    });
  });
}

test.describe('a desk, where the pane scrolls', () => {
  test.use(desktop);

  test('Back to another page opens its pane at the top, not as far down as the page it left', async ({page}) => {
    await page.goto('demos/?tab=z-index');
    await expect(page.getByRole('heading', {name: 'Why Third is on top'})).toBeAttached();
    await page.getByRole('navigation', {name: 'site'}).getByRole('link', {name: 'Users'}).click();
    await expect(page.getByRole('heading', {name: 'Users'})).toBeVisible();
    await page.getByRole('main').hover();
    await page.mouse.wheel(0, 600);
    await expect.poll(() => paneScrollTop(page)).toBeGreaterThan(0);

    await page.goBack();

    await expect(page.getByRole('heading', {name: 'Why Third is on top'})).toBeAttached();
    await expect.poll(() => paneScrollTop(page)).toBe(0);
  });
});

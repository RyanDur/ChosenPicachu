import {Page, expect, test} from '@playwright/test';
import {desktop, iPadSideways, iPadUpright, phone} from './__test_support';

const scrolled = (page: Page): Promise<{document: number; pane: number}> => page.evaluate(() => {
  const main = document.querySelector('main');
  return {document: window.scrollY, pane: main instanceof HTMLElement ? main.scrollTop : 0};
});

const documentScrollY = (page: Page): Promise<number> => page.evaluate(() => window.scrollY);

const documentScrolled = async (page: Page): Promise<void> => {
  await expect.poll(() => scrolled(page).then(({document}) => document)).toBeGreaterThan(0);
  expect((await scrolled(page)).pane).toBe(0);
};

const paneScrolled = async (page: Page): Promise<void> => {
  await expect.poll(() => scrolled(page).then(({pane}) => pane)).toBeGreaterThan(0);
  expect((await scrolled(page)).document).toBe(0);
};

const handheld = [
  {reader: 'a phone', device: phone},
  {reader: 'an iPad held upright', device: iPadUpright},
  {reader: 'an iPad held sideways', device: iPadSideways}
];

for (const {reader, device} of handheld) {
  test.describe(reader, () => {
    test.use(device);

    test('the home page scrolls like a page', async ({page}) => {
      await page.goto('');
      await page.getByRole('link', {name: 'Start where the demos start'}).scrollIntoViewIfNeeded();

      await documentScrolled(page);
    });

    test('a demos tab scrolls like a page', async ({page}) => {
      await page.goto('demos/?tab=tables');
      await page.getByRole('heading').last().scrollIntoViewIfNeeded();

      await documentScrolled(page);
    });

    test('following a link lands at the top of the next page', async ({page}) => {
      await page.goto('');

      await page.getByRole('link', {name: 'Start where the demos start'}).click();
      await expect(page.getByRole('navigation', {name: 'demos'})).toBeVisible();

      await expect.poll(() => documentScrollY(page)).toBe(0);
    });

    test('going back lands where the reader left', async ({page}) => {
      await page.goto('');
      const away = page.getByRole('link', {name: 'Start where the demos start'});
      await away.scrollIntoViewIfNeeded();
      const left = await documentScrollY(page);
      expect(left).toBeGreaterThan(0);

      await away.click();
      await expect(page.getByRole('navigation', {name: 'demos'})).toBeVisible();
      await page.goBack();

      await expect(page.getByRole('link', {name: 'Start where the demos start'})).toBeVisible();
      await expect.poll(() => documentScrollY(page)).toBe(left);
    });
  });
}

test.describe('an iPad-sized window with a mouse', () => {
  test.use({viewport: iPadSideways.viewport});

  test('keeps the page in its frame', async ({page}) => {
    await page.goto('');
    await page.getByRole('link', {name: 'Start where the demos start'}).scrollIntoViewIfNeeded();

    await paneScrolled(page);
  });
});

test.describe('a desktop', () => {
  test.use(desktop);

  test('keeps the page in its frame', async ({page}) => {
    await page.goto('');
    await page.getByRole('link', {name: 'Start where the demos start'}).scrollIntoViewIfNeeded();

    await paneScrolled(page);
  });
});

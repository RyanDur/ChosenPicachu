import {Page, expect, test} from '@playwright/test';
import {desktop, documentScrollY, homePage, iPadSideways, iPadUpright, paneScrollTop, phone} from './__test_support';

const scrolled = async (page: Page): Promise<{document: number; pane: number}> =>
  ({document: await documentScrollY(page), pane: await paneScrollTop(page)});

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
      await homePage(page).linkToTheDemos.scrollIntoViewIfNeeded();

      await documentScrolled(page);
    });

    test('a demos tab scrolls like a page', async ({page}) => {
      await page.goto('demos/?tab=tables');
      await page.getByRole('heading').last().scrollIntoViewIfNeeded();

      await documentScrolled(page);
    });

    test('going back lands where the reader left', async ({page}) => {
      await page.goto('');
      const away = homePage(page).linkToTheDemos;
      await away.scrollIntoViewIfNeeded();
      const left = await documentScrollY(page);
      expect(left).toBeGreaterThan(0);

      await away.click();
      await expect(page.getByRole('navigation', {name: 'demos'})).toBeVisible();
      await page.goBack();

      await expect(homePage(page).linkToTheDemos).toBeVisible();
      await expect.poll(() => documentScrollY(page)).toBe(left);
    });
  });
}

test.describe('an iPad-sized window with a mouse', () => {
  test.use({viewport: iPadSideways.viewport});

  test('keeps the page in its frame', async ({page}) => {
    await page.goto('');
    await homePage(page).linkToTheDemos.scrollIntoViewIfNeeded();

    await paneScrolled(page);
  });
});

test.describe('a desktop', () => {
  test.use(desktop);

  test('keeps the page in its frame', async ({page}) => {
    await page.goto('');
    await homePage(page).linkToTheDemos.scrollIntoViewIfNeeded();

    await paneScrolled(page);
  });
});

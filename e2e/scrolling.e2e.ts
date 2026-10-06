import {Page, expect, test} from '@playwright/test';
import {clickWhereItIs, desktop, documentScrollY, feedbackOn, homePage, iPadSideways, iPadUpright, paneScrollTop, phone, settledScrollY} from './__test_support';

const scrolled = async (page: Page): Promise<{document: number; pane: number}> =>
  ({document: await documentScrollY(page), pane: await paneScrollTop(page)});

const documentScrolled = async (page: Page): Promise<void> => {
  await expect.poll(() => scrolled(page).then(({document}) => document)).toBeGreaterThan(0);
  expect((await scrolled(page)).pane).toBe(0);
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

const desks = [
  {reader: 'a desktop', viewport: desktop.viewport},
  {reader: 'an iPad-sized window with a mouse', viewport: iPadSideways.viewport},
  {reader: 'an upright iPad-sized window with a mouse', viewport: iPadUpright.viewport}
];

const frameInView = async (page: Page): Promise<void> => {
  await expect(page.getByRole('banner')).toBeInViewport();
  await expect(page.getByRole('navigation', {name: 'site'})).toBeInViewport();
};

for (const {reader, viewport} of desks) {
  test.describe(reader, () => {
    test.use({viewport});

    test('the home page scrolls like a page, with the frame in view', async ({page}) => {
      await page.goto('');
      await homePage(page).linkToTheDemos.scrollIntoViewIfNeeded();

      await documentScrolled(page);
      await frameInView(page);
    });

    test('a demos tab scrolls like a page, with the frame and the tab bar in view', async ({page}) => {
      await page.goto('demos/?tab=tables');
      await page.getByRole('heading').last().scrollIntoViewIfNeeded();

      await documentScrolled(page);
      await frameInView(page);
      await expect(page.getByRole('navigation', {name: 'demos'})).toBeInViewport();
    });

    test('Page Down moves the page straight after it arrives', async ({page}) => {
      await page.goto('demos/?tab=tables');
      await expect(page.getByRole('navigation', {name: 'demos'})).toBeVisible();

      await page.keyboard.press('PageDown');

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

    test('an address that names a step lands with the step below the tab bar', async ({page}) => {
      await page.goto('demos/?tab=tables#station-5');
      const step = page.getByRole('heading', {name: 'The trader can watch the market live, in windows'});
      await expect(step).toBeInViewport();

      const tabBar = page.getByRole('navigation', {name: 'demos'});
      await expect(tabBar).toBeVisible();
      const bar = await tabBar.boundingBox();
      if (bar === null) throw new Error('the tab bar has no box');
      await expect.poll(async () => (await step.boundingBox())?.y).toBeGreaterThanOrEqual(bar.y + bar.height);
    });

    test('an open Feedback dialog holds the page still', async ({page}) => {
      await page.goto('demos/?tab=tables');
      await expect(page.getByRole('navigation', {name: 'demos'})).toBeVisible();
      await page.keyboard.press('PageDown');
      await documentScrolled(page);
      const held = await settledScrollY(page);
      await clickWhereItIs(page, feedbackOn(page).open);
      await expect(feedbackOn(page).dialog).toBeVisible();

      await page.mouse.move(viewport.width / 2, viewport.height / 2);
      await page.mouse.wheel(0, 1000);

      await expect.poll(() => documentScrollY(page)).toBe(held);
    });
  });
}

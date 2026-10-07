import {Locator, expect, test} from '@playwright/test';
import {clickWhereItIs, desktop, feedbackOn, homePage, iPadSideways, iPadUpright, phone, phoneSideways} from './__test_support';

const readers = [
  {reader: 'a phone', use: phone},
  {reader: 'a phone held sideways', use: phoneSideways},
  {reader: 'an iPad held upright', use: iPadUpright},
  {reader: 'an iPad held sideways', use: iPadSideways},
  {reader: 'a desktop', use: {viewport: desktop.viewport}},
  {reader: 'an iPad-sized window with a mouse', use: {viewport: iPadSideways.viewport}},
  {reader: 'an upright iPad-sized window with a mouse', use: {viewport: iPadUpright.viewport}}
];

const desks = readers.filter(({use}) => !('hasTouch' in use));

const topOf = async (part: Locator): Promise<number> => (await part.boundingBox())?.y ?? Number.NaN;

for (const {reader, use} of readers) {
  test.describe(reader, () => {
    test.use(use);

    test('going back shows the link the reader left from', async ({page}) => {
      await page.goto('');
      const away = homePage(page).linkToTheDemos;
      await away.scrollIntoViewIfNeeded();
      await expect(homePage(page).opener).not.toBeInViewport();

      await away.click();
      await expect(page.getByRole('navigation', {name: 'demos'})).toBeVisible();
      await page.goBack();

      await expect(homePage(page).linkToTheDemos).toBeInViewport();
    });
  });
}

for (const {reader, use} of desks) {
  test.describe(reader, () => {
    test.use(use);

    test('Page Down moves the page straight after it arrives', async ({page}) => {
      await page.goto('demos/?tab=tables');
      const opening = page.getByRole('heading', {name: 'let’s build this feature'});
      await expect(opening).toBeVisible();
      const before = await topOf(opening);

      await page.keyboard.press('PageDown');

      await expect.poll(() => topOf(opening)).toBeLessThan(before);
    });

    test('an address that names a step shows the step', async ({page}) => {
      await page.goto('demos/?tab=tables#station-5');
      const step = page.getByRole('heading', {name: 'The trader can watch the market live, in windows'});

      await expect(step).toBeInViewport();
    });

    test('the wheel moves the page, and an open Feedback dialog holds it still', async ({page}) => {
      await page.goto('demos/?tab=tables');
      const held = page.getByRole('heading', {name: 'Slice the design into stories'});
      await held.scrollIntoViewIfNeeded();
      const shut = await topOf(held);
      await page.mouse.wheel(0, 200);
      await expect.poll(() => topOf(held)).toBeLessThan(shut);
      await clickWhereItIs(page, feedbackOn(page).open);
      await expect(feedbackOn(page).dialog).toBeVisible();
      const open = await topOf(held);

      await page.mouse.wheel(0, 1000);

      await expect.poll(() => topOf(held)).toBe(open);
    });
  });
}

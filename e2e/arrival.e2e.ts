import {type Page, expect, test} from '@playwright/test';
import {clickWhereItIs, desktop, documentScrollY, iPhone, siteFrame} from './__test_support';

const settledScrollY = async (page: Page): Promise<number> => {
  let last = Number.NaN;
  await expect.poll(async () => {
    const now = await documentScrollY(page);
    const still = now === last;
    last = now;
    return still;
  }, {message: 'the page to stop scrolling'}).toBe(true);
  return last;
};

// Firefox restores a fractional scroll as much as a pixel and a fifth from where the reader left it, on a phone and on
// a desk
const theSamePlace = 2;

for (const [frame, device] of [['a phone', iPhone], ['a desk', desktop]] as const) {
  test.describe(frame, () => {
    test.use(device);

    test('Back to a tutorial from another tab, and Forward again, return the reader to where they were', async ({page}) => {
      await page.goto('demos/tables/#station-5');
      await expect(page.getByRole('heading', {name: 'The trader can watch the market live, in windows'})).toBeInViewport();
      const atTheTutorial = await documentScrollY(page);
      await clickWhereItIs(page, page.getByRole('navigation', {name: 'demos'}).getByRole('link', {name: 'Z-index'}));
      await expect(page.getByRole('heading', {name: 'Why Third is on top'})).toBeAttached();
      const onTheOtherTab = await documentScrollY(page);

      await page.goBack();

      await expect(page.getByRole('heading', {name: 'Slice the design into stories'})).toBeAttached();
      await expect.poll(async () => Math.abs(await documentScrollY(page) - atTheTutorial))
        .toBeLessThanOrEqual(theSamePlace);

      await page.goForward();

      await expect(page.getByRole('heading', {name: 'Why Third is on top'})).toBeAttached();
      await expect.poll(async () => Math.abs(await documentScrollY(page) - onTheOtherTab))
        .toBeLessThanOrEqual(theSamePlace);
    });
  });
}

test('a page opened by its address after another opens at its top, not where the reader left the other', async ({page}) => {
  await page.goto('record/');
  await siteFrame(page).hydrated();
  await page.mouse.wheel(0, 3000);
  await expect.poll(() => documentScrollY(page)).toBeGreaterThan(300);

  await page.goto('demos/tables/');
  await siteFrame(page).hydrated();

  expect(await documentScrollY(page)).toBe(0);
});

test('a reload returns the reader to where they were on the page', async ({page}) => {
  await page.goto('record/');
  await siteFrame(page).hydrated();
  await page.mouse.wheel(0, 3000);
  await expect.poll(() => documentScrollY(page)).toBeGreaterThan(300);
  const where = await settledScrollY(page);

  // Playwright's reload in Firefox opens the address anew rather than reloading the entry the reader is on
  await Promise.all([page.waitForEvent('load'), page.evaluate(() => location.reload())]);
  await siteFrame(page).hydrated();

  await expect.poll(() => documentScrollY(page)).toBe(where);
});

import {Locator, expect} from '@playwright/test';
import {test} from './__test_support/journey';
import {assertionPatience} from './__test_support/patience';
import {boxOf, clickWhereItIs, documentScrollY, feedbackOn, recordPage, siteFrame, twoFramesLater} from './__test_support';

const topOf = async (part: Locator): Promise<number> => (await boxOf(part)).y;
const risesAbove = async (part: Locator, mark: number): Promise<void> =>
  expect(async () => expect(await topOf(part)).toBeLessThan(mark)).toPass({timeout: assertionPatience});

test('going back shows the link the reader left from', {
  tag: ['@phone', '@phoneSideways', '@iPadUpright', '@iPadSideways', '@desktop', '@iPadSidewaysWindow', '@iPadUprightWindow']
}, async ({page}) => {
  await page.goto('record/');
  const away = recordPage(page).linkToTheDemos;
  await away.scrollIntoViewIfNeeded();
  await expect(recordPage(page).timelineStories.first()).not.toBeInViewport();

  await away.click();
  await expect(page.getByRole('navigation', {name: 'demos'})).toBeVisible();
  await page.goBack();

  await expect(recordPage(page).linkToTheDemos).toBeInViewport();
});

test.describe('a keyboard and a mouse', {tag: ['@desktop', '@iPadSidewaysWindow', '@iPadUprightWindow']}, () => {
  test('Page Down moves the page straight after it arrives', async ({page}) => {
    await page.goto('demos/tables/');
    const opening = page.getByRole('heading', {name: 'let’s build this feature'});
    await expect(opening).toBeVisible();
    const before = await topOf(opening);

    await page.keyboard.press('PageDown');

    await risesAbove(opening, before);
  });

  test('a tab switch keeps the tabs where they were on screen', async ({page}) => {
    await page.goto('demos/tables/the-live-table-and-the-store/');
    await siteFrame(page).hydrated();
    await page.getByRole('group').filter({has: page.getByText(/^so that /)}).nth(1).scrollIntoViewIfNeeded();
    await expect.poll(() => documentScrollY(page)).toBeGreaterThan(0);
    const tabs = page.getByRole('navigation', {name: 'demos'});
    const where = await topOf(tabs);

    await clickWhereItIs(page, tabs.getByRole('link', {name: 'Z-index'}));

    await expect(page.getByRole('heading', {name: 'Why Third is on top'})).toBeAttached();
    await twoFramesLater(page);
    expect(await topOf(tabs)).toBe(where);
  });

  test('an address that names a step shows the step', async ({page}) => {
    await page.goto('demos/tables/#station-6');
    const step = page.getByRole('heading', {name: 'Add features, in the order they were asked for'});

    await expect(step).toBeInViewport();
  });

  test('the wheel moves the page, and an open Feedback dialog holds it still', async ({page}) => {
    await page.goto('demos/tables/the-live-table-and-the-store/');
    await siteFrame(page).hydrated();
    const held = page.getByRole('heading', {name: 'The trader can watch the market live, one lookback beside another'});
    await held.scrollIntoViewIfNeeded();
    const shut = await topOf(held);
    const {x, y, width, height} = await boxOf(held);
    await page.mouse.move(x + width / 2, y + height / 2);
    await page.mouse.wheel(0, 200);
    await risesAbove(held, shut);
    await clickWhereItIs(page, feedbackOn(page).open);
    await expect(feedbackOn(page).dialog).toBeVisible();
    const open = await topOf(held);

    await page.mouse.wheel(0, 1000);

    await twoFramesLater(page);
    expect(await topOf(held)).toBe(open);
  });
});

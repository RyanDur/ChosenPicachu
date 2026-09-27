import {Locator, Page, expect, test} from '@playwright/test';

const folds = (page: Page): Locator =>
  page.getByRole('article').filter({has: page.getByRole('heading', {name: 'Exclusive accordion using details elements'})}).getByRole('group');

const summaryOf = (fold: Locator): Locator => fold.getByText(/^\w+$/).first();
const storyOf = (fold: Locator): Locator => fold.getByRole('paragraph', {includeHidden: true});

const heightByTheNextFrame = (fold: Locator): Promise<number> => fold.evaluate(details =>
  new Promise<number>(resolve => requestAnimationFrame(() => resolve(details.getBoundingClientRect().height))));

const heightOnceSettled = async (fold: Locator): Promise<number> => {
  await fold.evaluate(details => Promise.all(details.getAnimations({subtree: true}).map(motion => motion.finished)));
  return heightByTheNextFrame(fold);
};

test('a details fold slides open where the browser can animate it', async ({page, browserName}) => {
  test.skip(browserName !== 'chromium', 'only chromium animates a details element to its natural height');
  await page.goto('demos/?tab=accordions');
  const fold = folds(page).first();

  await summaryOf(fold).click();
  const midway = await heightByTheNextFrame(fold);

  expect(midway).toBeLessThan(await heightOnceSettled(fold));
});

test('a details fold opens at once, fully, where the browser cannot animate it', async ({page, browserName}) => {
  test.skip(browserName === 'chromium', 'chromium animates it');
  await page.goto('demos/?tab=accordions');
  const fold = folds(page).first();

  await summaryOf(fold).click();
  const midway = await heightByTheNextFrame(fold);

  expect(midway).toBe(await heightOnceSettled(fold));
  await expect(storyOf(fold)).toBeVisible();
});

test('a reader who asks for less motion gets a details fold open at once', async ({page}) => {
  await page.emulateMedia({reducedMotion: 'reduce'});
  await page.goto('demos/?tab=accordions');
  const fold = folds(page).first();

  await summaryOf(fold).click();
  const midway = await heightByTheNextFrame(fold);

  expect(midway).toBe(await heightOnceSettled(fold));
});

test('opening a second details fold closes the first, from the keyboard too', async ({page}) => {
  await page.goto('demos/?tab=accordions');
  const [first, second] = [folds(page).nth(0), folds(page).nth(1)];
  await summaryOf(first).click();
  await expect(storyOf(first)).toBeVisible();

  await summaryOf(second).focus();
  await page.keyboard.press('Enter');

  await expect(storyOf(second)).toBeVisible();
  await expect(storyOf(first)).toBeHidden();
});

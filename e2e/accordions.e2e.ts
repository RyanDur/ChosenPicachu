import {Locator, Page, expect, test} from '@playwright/test';
import {accordionsTab, builds, codedStepLayouts, desktop, firstHeightAfter, heightByTheNextFrame, heightOnceSettled, iPhone, pictureInRunPlacements, textOf, wordOn} from './__test_support';

const detailsParts = (page: Page): Locator => accordionsTab(page).partsOf('the details build');

test('a details fold slides open where the browser can animate it', async ({page, browserName}) => {
  test.skip(browserName !== 'chromium', 'only chromium animates a details element to its natural height');
  await page.goto('demos/?tab=accordions');
  const fold = detailsParts(page).first();

  await wordOn(fold).click();
  const midway = await heightByTheNextFrame(fold);

  expect(midway).toBeLessThan(await heightOnceSettled(fold));
});

test('a details fold opens at once, fully, where the browser cannot animate it', async ({page, browserName}) => {
  test.skip(browserName === 'chromium', 'chromium animates it');
  await page.goto('demos/?tab=accordions');
  const fold = detailsParts(page).first();

  await wordOn(fold).click();
  const midway = await heightByTheNextFrame(fold);

  expect(midway).toBe(await heightOnceSettled(fold));
  await expect(textOf(fold)).toBeVisible();
});

test('opening a second details fold closes the first, from the keyboard too', async ({page}) => {
  await page.goto('demos/?tab=accordions');
  const [first, second] = [detailsParts(page).nth(0), detailsParts(page).nth(1)];
  await wordOn(first).click();
  await expect(textOf(first)).toBeVisible();

  await wordOn(second).focus();
  await page.keyboard.press('Enter');

  await expect(textOf(second)).toBeVisible();
  await expect(textOf(first)).toBeHidden();
});

for (const {reader, device, layout} of [
  {reader: 'a phone held upright', device: iPhone, layout: 'code below prose'},
  {reader: 'a desktop', device: desktop, layout: 'code beside prose'}
] as const) {
  test.describe(reader, () => {
    test.use(device);

    test(`reads the accordions explanation with the ${layout} on every step`, async ({page}) => {
      await page.goto('demos/?tab=accordions');
      await expect(page.getByRole('code').first()).toBeVisible();

      await expect.poll(async () => [...new Set(await codedStepLayouts(page))]).toEqual([layout]);
    });
  });
}

for (const build of builds) {
  test(`a reader who asks for less motion gets ${build} open at once`, async ({page, browserName}) => {
    test.skip(build === 'the details build' && browserName !== 'chromium', 'only chromium animates a details element to its natural height');
    await page.emulateMedia({reducedMotion: 'reduce'});
    await page.goto('demos/?tab=accordions');
    const part = accordionsTab(page).firstPartOf(build);
    await expect(part.fold).toBeVisible();
    const closed = await heightByTheNextFrame(part.fold);

    const firstMoved = firstHeightAfter(part.fold, closed);
    await part.open();
    await expect.poll(part.isOpen).toBe(true);

    expect(await firstMoved).toBeGreaterThan(closed);
    expect(await firstMoved).toBe(await heightOnceSettled(part.fold));
  });
}

for (const build of ['the React checkbox build', 'the React radio build'] as const) {
  test(`a closed fold in ${build} shows only its bar`, async ({page}) => {
    await page.goto('demos/?tab=accordions');
    const parts = accordionsTab(page).partsOf(build);
    await expect(parts.first()).toBeVisible();

    for (const part of await parts.all()) {
      await part.scrollIntoViewIfNeeded();
      await expect(textOf(part)).toBeAttached();
      await expect(textOf(part)).not.toBeInViewport();
    }
  });
}

test.describe('a desktop', () => {
  test.use(desktop);

  test('sees each diagram under its prose and beside its code', async ({page}) => {
    await page.goto('demos/?tab=accordions');
    await expect(page.getByRole('figure').first()).toBeVisible();

    await expect.poll(async () => [...new Set(await pictureInRunPlacements(page))]).toEqual(['under its prose, beside its code']);
  });
});

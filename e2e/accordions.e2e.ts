import {Locator, Page, expect, test} from '@playwright/test';
import {codedStepLayouts, desktop, iPhone} from './__test_support';

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

const buildNamed = (page: Page, name: string): Locator =>
  page.getByRole('article').filter({has: page.getByRole('heading', {name, exact: true})}).first();

for (const {build, fold, press, opened} of [
  {build: 'Accordion using checkboxes', fold: 0, press: (part: Locator) => part.getByText(/^\w+$/).first(), opened: (part: Locator) => expect(part.getByRole('checkbox')).toBeChecked()},
  {build: 'Accordion using a radio group', fold: 1, press: (part: Locator) => part.getByText(/^\w+$/).first(), opened: (part: Locator) => expect(part.getByRole('radio')).toBeChecked()},
  {build: 'Exclusive accordion using details elements', fold: 0, press: (part: Locator) => summaryOf(part), opened: (part: Locator) => expect(part).toHaveJSProperty('open', true)},
  {build: 'Exclusive accordion using checkboxes', fold: 0, press: (part: Locator) => part.getByText('Open', {exact: true}), opened: (part: Locator) => expect(part.getByRole('checkbox')).toBeChecked()},
  {build: 'Exclusive accordion using radio group', fold: 0, press: (part: Locator) => part.getByText('Open', {exact: true}), opened: (part: Locator) => expect(part.getByRole('radio')).toBeChecked()}
]) {
  test(`a reader who asks for less motion gets the ${build.toLowerCase()} open at once`, async ({page}) => {
    await page.emulateMedia({reducedMotion: 'reduce'});
    await page.goto('demos/?tab=accordions');
    const part = buildNamed(page, build).getByRole(build.includes('details') ? 'group' : 'listitem').nth(fold);

    await press(part).click();
    await opened(part);
    const midway = await heightByTheNextFrame(part);

    expect(midway).toBe(await heightOnceSettled(part));
    expect(midway).toBeGreaterThan(80);
  });
}

for (const build of ['Exclusive accordion using checkboxes', 'Exclusive accordion using radio group']) {
  test(`a closed fold in the ${build.toLowerCase()} shows only its bar`, async ({page}) => {
    await page.goto('demos/?tab=accordions');
    const folds = page.getByRole('article').filter({has: page.getByRole('heading', {name: build, exact: true})}).first().getByRole('listitem');
    await expect(folds.first()).toBeVisible();

    for (const fold of await folds.all()) {
      const [whole, bar] = await Promise.all([fold.boundingBox(), fold.getByRole('heading').locator('xpath=..').boundingBox()]);
      expect(whole !== null && bar !== null && Math.abs(whole.height - bar.height) <= 1).toBe(true);
    }
  });
}

test.describe('a desktop', () => {
  test.use(desktop);

  test('sees each diagram under its prose and beside its code', async ({page}) => {
    await page.goto('demos/?tab=accordions');
    const runs = page.getByRole('listitem').filter({has: page.getByRole('figure'), hasNot: page.getByRole('article')});
    await expect(runs.first()).toBeVisible();

    for (const run of await runs.all()) {
      const [words, figure, code] = await Promise.all([
        run.getByRole('paragraph').first().boundingBox(),
        run.getByRole('figure').boundingBox(),
        run.getByRole('code').boundingBox()
      ]);
      expect(words !== null && figure !== null && code !== null
        && figure.y >= words.y + words.height && figure.x + figure.width <= code.x).toBe(true);
    }
  });
});

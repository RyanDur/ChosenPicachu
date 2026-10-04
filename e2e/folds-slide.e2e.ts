import {Page, expect, test} from '@playwright/test';
import {maybe} from '@ryandur/sand';
import {heightsBetween, ringPixelsLeftOf} from './__test_support';

const folds: {fold: string; at: string; story?: string; find: (page: Page) => ReturnType<Page['getByRole']>; bar: string | RegExp}[] = [
  {fold: 'a home page door', at: '', find: (page: Page) => page.getByRole('group').filter({has: page.getByText('how I organize it', {exact: true})}).first(), bar: 'how I organize it'},
  {fold: 'a story on the z-index tab', at: 'demos/?tab=z-index', find: (page: Page) => page.getByRole('group', {name: /^The user can have multiple banners/}), bar: 'The user can have multiple banners'},
  {fold: '“how we built it” on the tables tab', at: 'demos/?tab=tables', story: 'The trader can read the market in a table',
    find: (page: Page) => page.getByRole('group', {name: 'how we built it'}).first(), bar: 'how we built it'},
  {fold: '“what am I looking at?” on a chart', at: 'demos/?tab=charts', find: (page: Page) => page.getByRole('group').filter({has: page.getByText('what am I looking at?', {exact: true})}).first(), bar: 'what am I looking at?'},
  {fold: '“settings” on the drag sort tab', at: 'demos/?tab=dragAndDrop', find: (page: Page) => page.getByRole('group', {name: 'settings'}).first(), bar: /^settings/}
];

test.describe('a desk', () => {
  test.use({viewport: {width: 1440, height: 900}});

  for (const {fold, at, story, find, bar} of folds) {
    test(`slides ${fold} open and shut, where the accordion's folds can`, async ({page}) => {
      await page.goto(at);
      await maybe(story).map(title =>
        page.getByRole('group', {name: title, exact: true}).first().getByRole('heading', {name: title, exact: true}).click()).orElse(undefined);
      const details = find(page);
      const slides = await page.evaluate(() => CSS.supports('interpolate-size', 'allow-keywords'));
      const pressing = details.getByText(bar, {exact: typeof bar === 'string'}).first();
      await pressing.scrollIntoViewIfNeeded();

      // where nothing slides, WebKit still lays an opened fold out over two frames, so one height between is at once
      const {least, most} = slides ? {least: 3, most: Infinity} : {least: 0, most: 1};
      const opening = await heightsBetween(details, pressing);
      const shutting = await heightsBetween(details, pressing);

      expect(opening).toBeGreaterThanOrEqual(least);
      expect(opening).toBeLessThanOrEqual(most);
      expect(shutting).toBeGreaterThanOrEqual(least);
      expect(shutting).toBeLessThanOrEqual(most);
    });
  }

  test('keeps the snap in the accordion in HTML alone', async ({page}) => {
    await page.goto('demos/?tab=accordions');
    const part = page.getByRole('region', {name: 'An accordion in HTML alone'});
    const fold = part.getByRole('group').filter({has: page.getByText('basalt', {exact: true})});
    await fold.scrollIntoViewIfNeeded();

    expect(await heightsBetween(fold, fold.getByText('basalt', {exact: true}))).toBe(0);
  });
});

test.describe('a desk, at a link that starts a line in a fold', () => {
  test.use({viewport: {width: 1440, height: 900}});

  test('keeps the left side of its focus ring', async ({page, browserName}) => {
    test.skip(browserName === 'webkit', 'WebKit’s Tab passes over links, as Safari’s does, so no ring is drawn to keep');
    await page.goto('');
    const door = page.getByRole('group').filter({has: page.getByText('how I organize it', {exact: true})}).first();
    await door.getByText('how I organize it', {exact: true}).click();
    const link = door.getByRole('link', {name: 'progress', exact: true});
    await expect(link).toBeVisible();

    expect(await ringPixelsLeftOf(page, link)).toBeGreaterThan(0);
  });
});

test.describe('a desk, with the accordions’ motion set to Static', () => {
  test.use({viewport: {width: 1440, height: 900}});

  test('keeps the snap in an accordion that teaches it', async ({page}) => {
    await page.goto('demos/?tab=accordions&style=static');
    const part = page.getByRole('region', {name: 'What the platform gives now'});
    const fold = part.getByRole('group').first();
    const name = (await fold.innerText()).split('\n')[0].trim();
    const bar = fold.getByText(name, {exact: true}).first();
    await bar.scrollIntoViewIfNeeded();

    expect(await heightsBetween(fold, bar)).toBe(0);
  });
});

test.describe('a reader who asks for less motion', () => {
  test.use({viewport: {width: 1440, height: 900}});

  test('opens a story at once', async ({page}) => {
    await page.emulateMedia({reducedMotion: 'reduce'});
    await page.goto('demos/?tab=z-index');
    const story = page.getByRole('group', {name: /^The user can have multiple banners/});
    const bar = story.getByText('The user can have multiple banners', {exact: true}).first();
    await bar.scrollIntoViewIfNeeded();

    expect(await heightsBetween(story, bar)).toBe(0);
  });
});

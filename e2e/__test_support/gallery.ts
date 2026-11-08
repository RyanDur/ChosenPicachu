import type {Locator, Page} from '@playwright/test';
import {readFileSync} from 'node:fs';
import * as schema from 'schemawax';
import {not} from '@ryandur/sand';
import {assertionPatience} from './patience';

const stageAnswers = schema.array(schema.object({
  required: {key: schema.string, contentType: schema.string, body: schema.string}
}));

const recordedOnTheStage = (key: string) =>
  stageAnswers.forceDecode(JSON.parse(readFileSync('scripts/lighthouse/fixtures/rest.json', 'utf8')))
    .find(answer => answer.key === key);

const theArtInstitutesOpeningPicture = '**/2d484387-2509-5e8e-2c43-22f9981972eb/info.json';

export const galleryPage = (page: Page) => {
  const wall = page.getByRole('figure');
  const searchField = page.getByLabel(/Search For/);
  return {
    doors: page.getByRole('navigation', {name: 'museums'}).getByRole('link'),
    wall,
    searchField,
    pageNumber: page.getByLabel(/^Page #/),
    pageSize: page.getByLabel(/Per Page$/),
    settings: page.getByRole('group', {name: 'gallery settings'}),
    openSettings: async (): Promise<void> => {
      if (await searchField.isHidden()) await page.getByRole('group', {name: 'gallery settings'}).getByText(/page \d+/).click();
      await searchField.waitFor();
      await page.getByRole('group', {name: 'gallery settings'})
        .evaluate(fold => Promise.all(fold.getAnimations({subtree: true}).map(motion => motion.finished)));
    },
    submitSearch: page.getByRole('button', {name: 'submit search'}),
    resetSearch: page.getByRole('button', {name: 'reset search'}),
    go: page.getByRole('button', {name: 'Go', exact: true}),
    nextPage: page.getByRole('navigation', {name: 'pagination'}).getByRole('link', {name: 'NEXT'}),
    settingsPanel: page.getByRole('complementary', {name: 'gallery settings'}),
    tapSearchLabel: (): Promise<void> => page.getByText('Search For:', {exact: true}).click(),
    emptyWall: page.getByAltText('the museum answered with nothing'),
    firstPainting: wall.first().getByRole('link').first(),
    picturesNotShown: async (): Promise<string[]> => {
      const missing: string[] = [];
      for (const work of await wall.all()) {
        await work.scrollIntoViewIfNeeded();
        const alt = await work.getByRole('img', {includeHidden: true}).first().getAttribute('alt') ?? '';
        const shown = await work.getByRole('img', {name: alt, exact: true}).waitFor({state: 'visible', timeout: assertionPatience})
          .then(() => true, () => false);
        if (not(shown)) {
          missing.push(alt);
        }
      }
      return missing;
    },
    hangPageOneOnEveryPage: async (): Promise<void> => {
      await page.route(/\/vam\/objects\/search\?page=(?!1&)/, route => {
        const asked = new URL(route.request().url());
        asked.searchParams.set('page', '1');
        const pageOne = recordedOnTheStage(`${asked.pathname}${asked.search}`);
        return pageOne ? route.fulfill({contentType: pageOne.contentType, body: pageOne.body}) : route.fallback();
      });
    },
    refuseEveryPicture: async (): Promise<void> => {
      await page.route('**/vam-image/*/full/**', route => route.abort());
    },
    standInOf: (work: Locator): Locator => work.getByRole('img', {name: / would not load$/}),
    loadingSignOn: (work: Locator): Locator => work.getByRole('progressbar', {name: 'loading', exact: true}),
    holdEveryPicture: async (): Promise<() => void> => {
      const held: (() => void)[] = [];
      let letGo = false;
      await page.route('**/vam-image/*/full/**', route => {
        if (letGo) return route.fallback();
        return new Promise<void>(released => held.push(() => released(route.fallback())));
      });
      return () => {
        letGo = true;
        held.splice(0).forEach(release => release());
      };
    },
    holdTheArtInstitute: async (): Promise<void> => {
      await page.route(theArtInstitutesOpeningPicture, () => new Promise<void>(() => undefined));
    },
    countTheLoadingBarsUntilTheFirstPiece: async (): Promise<void> => {
      await page.addInitScript(() => {
        const counts: number[] = [];
        Reflect.set(globalThis, 'loadingBarsPerFrame', counts);
        const named = (element: Element): boolean => element.getAttribute('aria-label') === 'loading gallery';
        const count = (): void => {
          counts.push([...document.querySelectorAll('progress')].filter(named).length);
          if (!document.querySelector('figure')) {
            requestAnimationFrame(count);
          }
        };
        requestAnimationFrame(count);
      });
    },
    loadingBarsPerFrame: async (): Promise<number[]> => {
      const counts: unknown = await page.evaluate(() => Reflect.get(globalThis, 'loadingBarsPerFrame'));
      return Array.isArray(counts) ? counts.map(Number) : [];
    },
    searchFor: async (words: string): Promise<void> => {
      await page.getByLabel(/Search For/).fill(words);
      await page.getByRole('button', {name: 'submit search'}).click();
    }
  };
};

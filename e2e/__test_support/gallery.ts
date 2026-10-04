import type {Page} from '@playwright/test';

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
    searchLabelReadsInFull: (): Promise<boolean> => searchField.evaluate(field => {
      const label = field instanceof HTMLInputElement && field.labels !== null ? field.labels.item(0) : null;
      if (label === null) return false;
      const range = document.createRange();
      range.selectNodeContents(label);
      const text = range.getBoundingClientRect();
      const box = label.getBoundingClientRect();
      return text.top >= box.top - 1 && text.bottom <= box.bottom + 1;
    }),
    tapSearchLabel: (): Promise<void> => page.getByText('Search For:', {exact: true}).click(),
    emptyWall: page.getByAltText('the museum answered with nothing'),
    firstPainting: wall.first().getByRole('link').first(),
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
          if (document.querySelector('figure') === null) {
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

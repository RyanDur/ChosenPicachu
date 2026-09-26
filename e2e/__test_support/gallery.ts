import type {Page} from '@playwright/test';

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
    openSettings: (): Promise<void> => page.getByRole('group', {name: 'gallery settings'}).getByText(/page 1/).click(),
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
    searchFor: async (words: string): Promise<void> => {
      await page.getByLabel(/Search For/).fill(words);
      await page.getByRole('button', {name: 'submit search'}).click();
    }
  };
};

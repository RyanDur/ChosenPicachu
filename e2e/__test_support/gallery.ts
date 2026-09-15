import type {Page} from '@playwright/test';

export const galleryPage = (page: Page) => {
  const wall = page.getByRole('figure');
  return {
    doors: page.getByRole('navigation', {name: 'museums'}).getByRole('link'),
    wall,
    emptyWall: page.getByAltText('the museum answered with nothing'),
    firstPainting: wall.first().getByRole('link').first(),
    searchFor: async (words: string): Promise<void> => {
      await page.getByLabel(/Search For/).fill(words);
      await page.getByRole('button', {name: 'submit search'}).click();
    }
  };
};

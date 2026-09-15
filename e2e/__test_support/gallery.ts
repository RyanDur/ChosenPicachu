import type {Page} from '@playwright/test';

export const galleryPage = (page: Page) => {
  const figures = page.getByRole('figure');
  return {
    doors: page.getByRole('navigation', {name: 'museums'}).getByRole('link'),
    wall: figures,
    piece: figures,
    emptyWall: page.getByAltText('the museum answered with nothing'),
    firstPainting: figures.first().getByRole('link').first(),
    searchFor: async (words: string): Promise<void> => {
      await page.getByLabel(/Search For/).fill(words);
      await page.getByRole('button', {name: 'submit search'}).click();
    }
  };
};

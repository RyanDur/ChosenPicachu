import type {Locator, Page} from '@playwright/test';

export const doors = (page: Page): Locator => page.getByRole('navigation', {name: 'museums'}).getByRole('link');

export const wall = (page: Page): Locator => page.getByRole('figure');

export const emptyWall = (page: Page): Locator => page.getByAltText('empty gallery');

export const firstPainting = (page: Page): Locator => wall(page).first().getByRole('link').first();

export const searchFor = async (page: Page, words: string): Promise<void> => {
  await page.getByLabel(/Search For/).fill(words);
  await page.getByRole('button', {name: 'submit search'}).click();
};

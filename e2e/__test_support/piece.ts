import type {Page} from '@playwright/test';

export const piecePage = (page: Page) => ({
  piece: page.getByRole('figure')
});

import type {Page} from '@playwright/test';

export const developmentPage = (page: Page) => ({
  practice: page.getByRole('region', {name: 'how I organize it'})
});

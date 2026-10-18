import type {Page} from '@playwright/test';

export const practicePage = (page: Page) => ({
  practice: page.getByRole('region', {name: 'how I organize it'})
});

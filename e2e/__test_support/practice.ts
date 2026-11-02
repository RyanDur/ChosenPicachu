import type {Locator, Page} from '@playwright/test';

export const practicePage = (page: Page) => {
  const practice = page.getByRole('region', {name: 'how I organize it'});
  return {
    practice,
    title: (concern: string): Locator => page.getByRole('heading', {name: `Practice ${concern}`, level: 1}),
    momentLink: (name: string): Locator => practice.getByRole('link', {name}).first()
  };
};

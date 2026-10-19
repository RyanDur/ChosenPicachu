import type {Locator, Page} from '@playwright/test';

export const homePage = (page: Page) => ({
  opener: page.getByRole('paragraph').filter({hasText: /^A webpage is three languages/}),
  signpost: (concern: string, words: string): Locator =>
    page.getByRole('region', {name: concern, exact: true}).getByRole('link', {name: words, exact: true}),
  recipeStory: page.getByRole('region', {name: /yourself$/}).getByRole('group').first()
});

import type {Locator, Page} from '@playwright/test';

export const homePage = (page: Page) => ({
  momentLine: (section: string, name: string): Locator =>
    page.getByRole('list', {name: `${section}, from the record`}).getByRole('link', {name, exact: true}),
  opener: page.getByRole('paragraph').filter({hasText: /^A webpage is three languages/}),
  practices: page.getByRole('region', {name: /how I organize it$/}),
  recipeStory: page.getByRole('region', {name: /yourself$/}).getByRole('group').first()
});

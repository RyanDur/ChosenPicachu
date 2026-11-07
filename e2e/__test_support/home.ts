import type {Locator, Page} from '@playwright/test';

export const homePage = (page: Page) => ({
  openerLink: (name: string): Locator => page.getByRole('article').getByRole('link', {name, exact: true}),
  recipeStory: page.getByRole('region', {name: /yourself$/}).getByRole('group').first()
});

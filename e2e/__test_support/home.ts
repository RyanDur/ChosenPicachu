import type {Page} from '@playwright/test';

export const homePage = (page: Page) => ({
  recipeStory: page.getByRole('region', {name: /yourself$/}).getByRole('group').first()
});

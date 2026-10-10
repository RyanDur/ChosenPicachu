import type {Locator, Page} from '@playwright/test';

export const homePage = (page: Page) => ({
  linkToTheRecord: page.getByRole('link', {name: 'read the record'}),
  opener: page.getByRole('paragraph').filter({hasText: /^A webpage is three languages/}),
  doorFolds: page.getByRole('group').filter({has: page.getByText('how I organize it', {exact: true})}),
  recipeStory: page.getByRole('region', {name: /yourself$/}).getByRole('group').first(),
  doorSummaryOf: (door: Locator): Locator => door.getByText('how I organize it', {exact: true})
});

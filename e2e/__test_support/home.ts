import type {Locator, Page} from '@playwright/test';

export const homePage = (page: Page) => ({
  recordInTheRail: page.getByRole('region', {name: 'pages and feedback'}).getByRole('link', {name: 'Record', exact: true}),
  opener: page.getByRole('paragraph').filter({hasText: /^A webpage is three languages/}),
  doorFolds: page.getByRole('group').filter({has: page.getByText('how I organize it', {exact: true})}),
  recipeStory: page.getByRole('region', {name: /yourself$/}).getByRole('group').first(),
  doorSummaryOf: (door: Locator): Locator => door.getByText('how I organize it', {exact: true})
});

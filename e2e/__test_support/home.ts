import type {Locator, Page} from '@playwright/test';

export const homePage = (page: Page) => ({
  linkToTheDemos: page.getByRole('link', {name: 'Start where the demos start'}),
  opener: page.getByRole('paragraph').filter({hasText: /^A webpage is three languages/}),
  timelineStories: page.getByRole('list', {name: 'the timeline'}).getByRole('group'),
  doorFolds: page.getByRole('group').filter({has: page.getByText('how I organize it', {exact: true})}),
  researchFold: page.getByRole('region', {name: 'The research'}).getByRole('group').first(),
  recipeStory: page.getByRole('region', {name: /yourself$/}).getByRole('group').first(),
  fullerStoryOf: (story: Locator): Locator => story.getByText('the fuller story'),
  doorSummaryOf: (door: Locator): Locator => door.getByText('how I organize it', {exact: true}),
  storyTold: (story: Locator): Locator => story.getByRole('paragraph').first()
});

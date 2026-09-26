import type {Locator, Page} from '@playwright/test';

export const homePage = (page: Page) => ({
  linkToTheDemos: page.getByRole('link', {name: 'Start where the demos start'}),
  timelineStories: page.getByRole('list', {name: 'the timeline'}).getByRole('group'),
  recipeStory: page.getByRole('region', {name: /yourself$/}).getByRole('group').first(),
  fullerStoryOf: (story: Locator): Locator => story.getByText('the fuller story'),
  storyTold: (story: Locator): Locator => story.getByRole('paragraph').first()
});

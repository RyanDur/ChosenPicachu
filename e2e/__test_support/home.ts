import type {Locator, Page} from '@playwright/test';

export const homePage = (page: Page) => ({
  timelineStories: page.getByRole('list', {name: 'the timeline'}).getByRole('group'),
  recipeStory: page.getByRole('region', {name: /yourself$/}).getByRole('group').first(),
  fullerStoryOf: (story: Locator): Locator => story.getByText('the fuller story')
});

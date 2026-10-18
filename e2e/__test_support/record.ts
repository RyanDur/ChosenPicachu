import type {Locator, Page} from '@playwright/test';

export const recordPage = (page: Page) => ({
  title: page.getByRole('heading', {name: 'The record', level: 1}),
  linkToTheDemos: page.getByRole('link', {name: 'Start where the demos start'}),
  timelineStories: page.getByRole('list', {name: 'the timeline'}).getByRole('group'),
  moment: (title: string): Locator => page.getByRole('list', {name: 'the timeline'}).getByRole('listitem').filter({has: page.getByRole('heading', {name: title, exact: true})}).last(),
  timelineScope: '[aria-label="the timeline"]',
  researchFold: page.getByRole('region', {name: 'The research'}).getByRole('group').first(),
  fullerStoryOf: (story: Locator): Locator => story.getByText('the fuller story'),
  storyTold: (story: Locator): Locator => story.getByRole('paragraph').first()
});

import type {Locator, Page} from '@playwright/test';

export const timelineStories = (page: Page): Locator => page.getByRole('list', {name: 'the timeline'}).getByRole('group');

export const fullerStory = (story: Locator): Locator => story.getByText('the fuller story');

export const recipeStory = (page: Page): Locator => page.getByRole('region', {name: /yourself$/}).getByRole('group').first();

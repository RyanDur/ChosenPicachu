import type {Locator, Page} from '@playwright/test';
import {siteFrame} from './site';

const storyAt = (page: Page, position: number): Locator =>
  page.getByRole('group').filter({has: page.getByText(/^so that /)}).nth(position);

export const tablesDemo = (page: Page) => ({
  controls: page.getByRole('region', {name: 'table controls'}),
  storyAt: (position: number): Locator => storyAt(page, position),
  openStoryAt: async (position: number): Promise<void> => {
    await siteFrame(page).hydrated();
    await storyAt(page, position).getByText(/^so that /).click();
  },
  story: (titled: string): Locator =>
    page.getByRole('group').filter({has: page.getByText(/^so that /)}).filter({hasText: titled}).first(),
  openStory: async (titled: string): Promise<Locator> => {
    const story = page.getByRole('group').filter({has: page.getByText(/^so that /)}).filter({hasText: titled}).first();
    await siteFrame(page).hydrated();
    await story.getByText(/^so that /).first().click();
    return story;
  },
  howIBuiltItInTheFirstStory: async (): Promise<Locator> => {
    const story = storyAt(page, 0);
    await siteFrame(page).hydrated();
    await story.getByText(/^so that /).click();
    return story.getByRole('group', {name: 'how I built it'});
  }
});

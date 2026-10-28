import type {Locator, Page} from '@playwright/test';
import {siteFrame} from './site';

export const tablesDemo = (page: Page) => ({
  controls: page.getByRole('region', {name: 'table controls'}),
  howIBuiltItInTheFirstStory: async (): Promise<Locator> => {
    const story = page.getByRole('group').filter({has: page.getByText(/^so that /)}).first();
    await siteFrame(page).hydrated();
    await story.getByText(/^so that /).click();
    return story.getByRole('group', {name: 'how I built it'});
  }
});

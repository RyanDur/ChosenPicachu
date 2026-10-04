import type {Locator, Page} from '@playwright/test';

export const tablesDemo = (page: Page) => ({
  settingsFold: page.getByRole('group', {name: 'settings'}).first(),
  controls: page.getByRole('region', {name: 'table controls'}),
  pressSettings: (): Promise<void> => page.getByRole('group', {name: 'settings'}).first().getByText(/^settings/).click(),
  howWeBuiltItInTheFirstStory: async (): Promise<Locator> => {
    const story = page.getByRole('group').filter({has: page.getByText(/^so that /)}).first();
    await story.getByText(/^so that /).click();
    return story.getByRole('group', {name: 'how we built it'});
  }
});

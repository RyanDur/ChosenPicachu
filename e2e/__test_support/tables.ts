import type {Locator, Page} from '@playwright/test';
import {siteFrame} from './site';

const storyAt = (page: Page, position: number): Locator =>
  page.getByRole('group').filter({has: page.getByText(/^so that /)}).nth(position);

export const tablesDemo = (page: Page) => ({
  tutorials: {
    link: (name: string): Locator => page.getByRole('region', {name: 'Tables'}).getByRole('link', {name, exact: true}),
    title: (name: string): Locator => page.getByRole('heading', {level: 2, name, exact: true}),
    firstStory: page.getByRole('region', {name: /yourself$/}).getByRole('group').first()
  },
  controls: page.getByRole('region', {name: 'table controls'}),
  howIBuiltItInTheFirstStory: async (): Promise<Locator> => {
    await siteFrame(page).hydrated();
    return storyAt(page, 0).getByRole('group', {name: 'how I built it'});
  }
});

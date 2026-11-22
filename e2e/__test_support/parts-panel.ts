import type {Locator, Page} from '@playwright/test';
import {siteFrame} from './site';

export const partsPanel = (page: Page) => ({
  openTheSketch: async (): Promise<void> => {
    await page.goto('demos/tables/the-sketch/');
    await siteFrame(page).hydrated();
  },
  hideTheParts: (): Promise<void> => page.getByRole('button', {name: 'Hide parts'}).click(),
  showTheParts: (): Promise<void> => page.getByRole('button', {name: 'Show parts'}).click(),
  goToTheNextPart: (): Promise<void> =>
    page.getByRole('navigation', {name: 'the tables parts'}).getByRole('link', {name: /^Next: /}).click(),
  parts: page.getByRole('navigation', {name: 'Parts', exact: true}),
  showParts: page.getByRole('button', {name: 'Show parts'}),
  tabSize: page.getByText(/^Eight parts, about \d+ minutes\.$/),
  partTitled: (title: string): Locator => page.getByRole('heading', {level: 2, name: title, exact: true})
});

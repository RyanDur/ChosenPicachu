import type {Locator, Page} from '@playwright/test';
import {partFoot} from './part-foot';
import {siteFrame} from './site';

export const partsPanel = (page: Page) => ({
  openTheSketch: async (): Promise<void> => {
    await page.goto('demos/tables/the-sketch/');
    await siteFrame(page).hydrated();
  },
  hideTheParts: (): Promise<void> => page.getByRole('button', {name: 'Hide parts'}).click(),
  showTheParts: (): Promise<void> => page.getByRole('button', {name: 'Show parts'}).click(),
  goToTheNextPart: (): Promise<void> =>
    partFoot(page).links().filter({hasText: /^Next: /}).click(),
  parts: page.getByRole('navigation', {name: 'Parts', exact: true}),
  showParts: page.getByRole('button', {name: 'Show parts'}),
  partsAndMinutes: page.getByText(/^Eight parts, about \d+ minutes\.$/),
  partTitled: (title: string): Locator => page.getByRole('heading', {level: 2, name: title, exact: true})
});

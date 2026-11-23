import type {Locator, Page} from '@playwright/test';
import {partFoot} from './part-foot';
import {siteFrame} from './site';

export const partsPanel = (page: Page) => ({
  openTheSketch: async (): Promise<void> => {
    await page.goto('demos/tables/the-sketch/');
    await siteFrame(page).hydrated();
  },
  openTheTab: async (address = 'demos/tables/'): Promise<void> => {
    await page.goto(address);
    await siteFrame(page).hydrated();
  },
  goToTheTab: async (): Promise<void> => {
    await page.getByRole('navigation', {name: 'demos', exact: true}).getByRole('link', {name: 'Tables', exact: true}).click();
    await page.waitForURL(/demos\/tables\/\?parts=hidden$/);
  },
  hideTheParts: async (): Promise<void> => {
    await page.getByRole('button', {name: 'Hide parts'}).click();
    await page.getByRole('button', {name: 'Show parts'}).waitFor();
  },
  showTheParts: async (): Promise<void> => {
    await page.getByRole('button', {name: 'Show parts'}).click();
    await page.getByRole('button', {name: 'Hide parts'}).waitFor();
  },
  goToTheNextPart: (): Promise<void> =>
    partFoot(page).links().filter({hasText: /^Next: /}).click(),
  parts: page.getByRole('navigation', {name: 'Parts', exact: true}),
  showParts: page.getByRole('button', {name: 'Show parts'}),
  world: page.getByRole('group', {name: 'world'}),
  partsAndMinutes: page.getByText(/^Eight parts, about \d+ minutes\.$/),
  partTitled: (title: string): Locator => page.getByRole('heading', {level: 2, name: title, exact: true})
});

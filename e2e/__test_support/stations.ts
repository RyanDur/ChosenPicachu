import type {Locator, Page} from '@playwright/test';

export const courseStations = (page: Page) => ({
  sliceLink: (station: string): Locator =>
    page.getByRole('list', {name: 'the slices'}).getByRole('link', {name: station}).first(),
  dialsLink: page.getByRole('list', {name: 'the stations'}).getByRole('link', {name: 'dials', exact: true}).first()
});

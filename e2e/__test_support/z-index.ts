import type {Locator, Page} from '@playwright/test';

export const zIndexTab = (page: Page) => ({
  partLink: (name: string): Locator => page.getByRole('heading', {level: 2, name}).getByRole('link', {name, exact: true}),
  partTitle: (name: string): Locator => page.getByRole('heading', {level: 2, name, exact: true}),
  followsTheFoot: (name: string): Promise<void> =>
    page.getByRole('navigation', {name: 'the z-index parts'}).getByRole('link', {name, exact: true}).click(),
  raisesABanner: (): Promise<void> =>
    page.getByRole('region', {name: 'banner controls'}).getByRole('button', {name: 'Raise a banner', exact: true}).click(),
  newestBanner: (): Locator => page.getByRole('alert').getByRole('listitem').last()
});

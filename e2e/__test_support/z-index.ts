import type {Locator, Page} from '@playwright/test';

export const zIndexTab = (page: Page) => ({
  partLink: (name: string): Locator => page.getByRole('heading', {level: 2, name}).getByRole('link', {name, exact: true}),
  partTitle: (name: string): Locator => page.getByRole('heading', {level: 2, name, exact: true}),
  followsTheFoot: (name: string): Promise<void> =>
    page.getByRole('navigation', {name: 'the z-index parts'}).getByRole('link', {name, exact: true}).click()
});

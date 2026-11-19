import type {Locator, Page} from '@playwright/test';

export const zIndexTab = (page: Page) => {
  const raiser = page.getByRole('region', {name: 'banner controls'})
    .getByRole('button', {name: 'Raise a banner', exact: true});
  return {
    partLink: (name: string): Locator =>
      page.getByRole('navigation', {name: 'Parts'}).getByRole('link', {name, exact: true}),
    partTitle: (name: string): Locator => page.getByRole('heading', {level: 2, name, exact: true}),
    followsTheFoot: (name: string): Promise<void> =>
      page.getByRole('navigation', {name: 'the z-index parts'}).getByRole('link', {name, exact: true}).click(),
    raiser,
    raisesABanner: (): Promise<void> => raiser.click(),
    newestBanner: (): Locator => page.getByRole('alert').getByRole('listitem').last()
  };
};

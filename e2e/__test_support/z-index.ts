import type {Locator, Page} from '@playwright/test';
import {partFoot} from './part-foot';

export const zIndexTab = (page: Page) => {
  const partsNavigation = page.getByRole('navigation', {name: 'Parts', exact: true});
  const raiser = page.getByRole('region', {name: 'The banner, at the window’s edge'})
    .getByRole('button', {name: 'Raise a banner', exact: true});
  const banners = page.getByRole('alert').getByRole('listitem');
  return {
    partLink: (name: string): Locator => partsNavigation.getByRole('link', {name, exact: true}),
    partTitle: (name: string): Locator => page.getByRole('heading', {level: 2, name, exact: true}),
    followsTheFoot: (name: string): Promise<void> =>
      partFoot(page).link(name).click(),
    raiser,
    raisesABanner: (): Promise<void> => raiser.click(),
    banners,
    newestBanner: (): Locator => banners.last()
  };
};

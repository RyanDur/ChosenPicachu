import type {Locator, Page} from '@playwright/test';
import {partFoot} from './part-foot';

export const zIndexTab = (page: Page) => {
  const partsNavigation = page.getByRole('navigation', {name: 'Parts', exact: true});
  const raiser = page.getByRole('region', {name: 'The banner, at the window’s edge'})
    .getByRole('button', {name: 'Raise a banner', exact: true});
  return {
    partLink: (name: string): Locator => partsNavigation.getByRole('link', {name, exact: true}),
    partTitle: (name: string): Locator => page.getByRole('heading', {level: 2, name, exact: true}),
    followsTheFoot: (name: string): Promise<void> =>
      partFoot(page).link(name).click(),
    linkToTheBannerStory: (): Locator => page.getByRole('region', {name: 'Why a fixed banner still loses'})
      .getByRole('paragraph')
      .getByRole('link', {name: 'Let’s build this feature', exact: true}),
    raiser,
    raisesABanner: (): Promise<void> => raiser.click(),
    newestBanner: (): Locator => page.getByRole('alert').getByRole('listitem').last()
  };
};

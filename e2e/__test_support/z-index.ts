import type {Locator, Page} from '@playwright/test';

export const zIndexTab = (page: Page) => {
  const raiser = page.getByRole('region', {name: 'banner controls'})
    .getByRole('button', {name: 'Raise a banner', exact: true});
  return {
    partLink: (name: string): Locator =>
      page.getByRole('navigation', {name: 'Parts', exact: true}).getByRole('link', {name, exact: true}),
    partTitle: (name: string): Locator => page.getByRole('heading', {level: 2, name, exact: true}),
    followsTheFoot: (name: string): Promise<void> =>
      page.getByRole('navigation', {name: 'the z-index parts'}).getByRole('link', {name, exact: true}).click(),
    linkToTheBannerStory: (): Locator => page.getByRole('region', {name: 'Why a fixed banner still loses'})
      .getByRole('paragraph').filter({hasText: 'To build this banner yourself'})
      .getByRole('link', {name: 'Let’s build this feature', exact: true}),
    raiser,
    raisesABanner: (): Promise<void> => raiser.click(),
    newestBanner: (): Locator => page.getByRole('alert').getByRole('listitem').last()
  };
};

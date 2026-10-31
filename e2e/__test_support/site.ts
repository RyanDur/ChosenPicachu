import type {Page} from '@playwright/test';

export const siteFrame = (page: Page) => {
  const nav = page.getByRole('navigation', {name: 'site'});
  return {
    nav,
    title: page.getByRole('heading', {level: 1}),
    home: nav.getByRole('link', {name: 'Home', exact: true}),
    hydrated: (): Promise<void> => page.getByRole('dialog', {name: 'Feedback', includeHidden: true}).waitFor({state: 'attached'})
  };
};

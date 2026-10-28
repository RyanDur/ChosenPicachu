import type {Page} from '@playwright/test';

export const siteFrame = (page: Page) => {
  const nav = page.getByRole('navigation', {name: 'site'});
  return {
    nav,
    title: page.getByRole('heading', {level: 1}),
    home: nav.getByRole('link', {name: 'Home', exact: true}),
    // the document is drawn at build time, and Feedback arrives with the script that makes the page's controls work
    hydrated: (): Promise<void> => page.getByRole('button', {name: 'Feedback'}).waitFor({state: 'attached'})
  };
};

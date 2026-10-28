import type {Page} from '@playwright/test';

export type Reading = {readonly headings: string[]; readonly text: string};

export const siteFrame = (page: Page) => {
  const nav = page.getByRole('navigation', {name: 'site'});
  return {
    nav,
    title: page.getByRole('heading', {level: 1}),
    home: nav.getByRole('link', {name: 'Home', exact: true}),
    // the document is drawn at build time, and Feedback arrives with the script that makes the page's controls work
    hydrated: (): Promise<void> => page.getByRole('button', {name: 'Feedback'}).waitFor({state: 'attached'}),
    reading: (): Promise<Reading> => page.getByRole('main').evaluate(main => ({
      headings: [...main.querySelectorAll('h1, h2, h3, h4, h5, h6')].map(heading => heading.textContent.trim()),
      text: main.textContent.replace(/\s+/g, ' ').trim()
    }))
  };
};

import type {Page} from '@playwright/test';
import {pages, type SitePage} from '../pages';

export type View = {
  readonly name: string;
  readonly page: SitePage;
  readonly into?: (page: Page) => Promise<void>;
  readonly withoutWorkers?: true;
};

// the users backend draws its roster at random inside its service worker, out of a page's reach, so that page is
// compared without its worker: the form and the alert, never the rows
const atRest = (page: SitePage): View => page.name === 'users'
  ? {name: 'at rest, with no worker', page: {...page, ready: 'alert'}, withoutWorkers: true}
  : {name: 'at rest', page};

const missing = (name: string): never => {
  throw new Error(`no page named ${name}`);
};

const named = (name: string): SitePage => pages.find(page => page.name === name) ?? missing(name);

const hovered = async (page: Page, at: () => ReturnType<Page['locator']>): Promise<void> => {
  await at().hover();
  await page.waitForTimeout(400);
};

export const views: readonly View[] = [
  ...pages.map(atRest),
  {
    name: 'feedback open',
    page: named('demos'),
    into: async page => {
      await page.getByRole('button', {name: 'Feedback', exact: true}).click();
      await page.getByRole('dialog', {name: 'Feedback'}).waitFor();
      await page.mouse.move(0, 0);
    }
  },
  {
    name: 'feedback open, its second field focused',
    page: named('demos'),
    into: async page => {
      await page.getByRole('button', {name: 'Feedback', exact: true}).click();
      await page.getByRole('textbox', {name: 'A way to reach you, if you like'}).focus();
      await page.mouse.move(0, 0);
    }
  },
  {
    name: 'a tab pressed',
    page: named('demos'),
    into: async page => {
      const box = await page.getByRole('navigation', {name: 'demos'}).getByRole('listitem').nth(1).boundingBox();
      if (box === null) throw new Error('no tab to press');
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await page.mouse.down();
    }
  },
  {
    name: 'a rail link hovered',
    page: named('home'),
    into: page => hovered(page, () => page.getByRole('navigation', {name: 'site'}).getByRole('link').nth(1))
  },
  {
    name: 'a pill hovered',
    page: named('tables'),
    into: page => hovered(page, () => page.getByText('Vanilla', {exact: true}).first())
  }
];

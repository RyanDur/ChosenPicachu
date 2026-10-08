import type {Page} from '@playwright/test';
import {pages, type SitePage} from '../pages';

export type View = {
  readonly name: string;
  readonly page: SitePage;
  readonly into?: (page: Page) => Promise<void>;
  readonly withoutWorkers?: true;
  readonly held?: RegExp;
};

const atRest = (page: SitePage): View => {
  if (page.name === 'users') return {name: 'at rest, with no worker', page: {...page, ready: 'alert'}, withoutWorkers: true};
  if (page.name === 'gallery') return {name: 'at rest', page, into: next => next.getByRole('link', {name: 'NEXT'}).waitFor()};
  return {name: 'at rest', page};
};

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
    name: 'every fold open',
    page: named('home'),
    into: async page => {
      await page.evaluate(() => document.querySelectorAll('details').forEach(fold => {
        fold.removeAttribute('name');
        fold.open = true;
      }));
      await page.waitForTimeout(400);
    }
  },
  {
    name: 'a rail link hovered',
    page: named('home'),
    into: page => hovered(page, () => page.getByRole('navigation', {name: 'site'}).getByRole('link').nth(1))
  },
  {
    name: 'its wall still on the way',
    page: {...named('gallery'), loaded: page => page.getByRole('progressbar').first()},
    held: /\/vam\//
  },
  {
    name: 'its form with a field written wrong',
    page: {...named('users'), ready: 'alert'},
    withoutWorkers: true,
    into: async page => {
      await page.getByRole('form', {name: 'User Information'}).getByLabel('Email').fill('not an address');
      await page.getByRole('form', {name: 'User Information'}).getByLabel('First Name').focus();
      await page.mouse.move(0, 0);
    }
  },
  {
    name: 'a piece hovered',
    page: named('gallery'),
    into: async page => {
      await page.getByRole('link', {name: 'NEXT'}).waitFor();
      await hovered(page, () => page.getByRole('figure').first().getByRole('link'));
    }
  },
  {
    name: 'its page field focused',
    page: named('gallery'),
    into: async page => {
      await page.getByRole('link', {name: 'NEXT'}).waitFor();
      await page.getByLabel(/^Page #/).focus();
      await page.mouse.move(0, 0);
    }
  },
  {
    name: 'its search hovered',
    page: named('gallery'),
    into: async page => {
      await page.getByRole('link', {name: 'NEXT'}).waitFor();
      await hovered(page, () => page.getByRole('combobox', {name: /Search For/}));
    }
  },
  {
    name: 'at the lazy pace',
    page: {...named('tables'), path: 'demos/?tab=tables&pace=lazy'}
  },
  {
    name: 'a pill hovered',
    page: named('tables'),
    into: page => hovered(page, () => page.getByText('Vanilla', {exact: true}).first())
  }
];

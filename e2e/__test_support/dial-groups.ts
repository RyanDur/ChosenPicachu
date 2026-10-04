import type {Page} from '@playwright/test';

export type DialGroup = {names: string; pillEdges: number};

// each group of dials, read as where its names sit (above or beside their pills) and how many left edges its pills start at
export const dialGroups = (page: Page): Promise<DialGroup[]> => page.getByRole('main').evaluate(main =>
  [...main.querySelectorAll('ul')]
    .map(group => [...group.children].flatMap(row => {
      const name = row.querySelector(':scope > [aria-hidden]');
      const pills = row.querySelector(':scope > fieldset');
      return name && pills ? [{name: name.getBoundingClientRect(), pills: pills.getBoundingClientRect()}] : [];
    }))
    .filter(rows => rows.length > 1)
    .map(rows => ({
      names: [...new Set(rows.map(({name, pills}) => pills.top >= name.bottom - 1 ? 'above' : 'beside'))].join(' and '),
      pillEdges: new Set(rows.map(({pills}) => Math.round(pills.left))).size
    })));

export const dialGroupsLaidOutTwoWays = async (page: Page): Promise<DialGroup[]> =>
  (await dialGroups(page)).filter(({names, pillEdges}) => names.includes(' and ') || pillEdges > 1);

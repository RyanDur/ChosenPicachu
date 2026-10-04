import type {Locator, Page} from '@playwright/test';
import {empty, not} from '@ryandur/sand';

export type DialGroup = {names: string; pillEdges: number};

const rereadAfter = 500;

type DialRow = {name: {y: number; height: number}; pills: {x: number; y: number}};

const boxesOf = async (name: Locator, pills: Locator): Promise<DialRow[]> => {
  const [nameBox, pillsBox] = await Promise.all([name.boundingBox({timeout: rereadAfter}), pills.boundingBox({timeout: rereadAfter})]);
  return nameBox && pillsBox ? [{name: nameBox, pills: pillsBox}] : [];
};

const shownDialRow = async (row: Locator, dials: Locator): Promise<DialRow[]> => {
  const pills = row.locator(dials).first();
  const [, groupName = ''] = /group "([^"]+)"/.exec(await pills.ariaSnapshot({timeout: rereadAfter})) ?? [];
  const nameInTheRow = row.getByText(groupName, {exact: true});
  return not(empty(groupName)) && await nameInTheRow.count() > 0 ? boxesOf(nameInTheRow.first(), pills) : [];
};

const shownDialRows = async (list: Locator, dials: Locator): Promise<DialRow[]> =>
  (await Promise.all((await list.getByRole('listitem').filter({has: dials}).all()).map(row => shownDialRow(row, dials)))).flat();

export const dialGroups = async (page: Page): Promise<DialGroup[]> => {
  const dials = page.getByRole('group').filter({has: page.getByRole('radio')});
  const listsOfDials = page.getByRole('list').filter({has: dials});
  const innermost = await page.getByRole('main').getByRole('list').filter({has: dials}).filter({hasNot: listsOfDials}).all();
  const groups = await Promise.all(innermost.map(list => shownDialRows(list, dials)));
  return groups
    .filter(rows => rows.length > 1)
    .map(rows => ({
      names: [...new Set(rows.map(({name, pills}) => pills.y >= name.y + name.height - 1 ? 'above' : 'beside'))].join(' and '),
      pillEdges: new Set(rows.map(({pills}) => Math.round(pills.x))).size
    }));
};

export const dialGroupsLaidOutTwoWays = async (page: Page): Promise<DialGroup[]> =>
  (await dialGroups(page)).filter(({names, pillEdges}) => names.includes(' and ') || pillEdges > 1);

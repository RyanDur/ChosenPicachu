import type {Locator, Page} from '@playwright/test';

export type DialGroup = {names: string; pillEdges: number};

type Box = {x: number; y: number; width: number; height: number};

const boxesShown = (parts: Locator): Promise<Box[]> => parts.evaluateAll(elements => elements
  .map(element => element.getBoundingClientRect())
  .filter(box => box.width > 0 && box.right > 0 && box.left < innerWidth)
  .map(({x, y, width, height}) => ({x, y, width, height})));

const escaped = (name: string): string => name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const inside = (part: Box, row: Box): boolean =>
  part.x >= row.x - 1 && part.y >= row.y - 1 && part.x + part.width <= row.x + row.width + 1 && part.y + part.height <= row.y + row.height + 1;

const groupOf = async (list: Locator, dials: Locator): Promise<DialGroup[]> => {
  const names = [...(await list.ariaSnapshot()).matchAll(/group "([^"]+)"/g)].map(([, name]) => name);
  const [rowBoxes, pills, shownNames] = await Promise.all([
    boxesShown(list.getByRole('listitem').filter({has: dials})),
    boxesShown(list.locator(dials)),
    boxesShown(list.getByText(new RegExp(`^(${names.map(escaped).join('|')})$`)))
  ]);
  const rows = rowBoxes.flatMap(row => {
    const [pill, name] = [pills.find(part => inside(part, row)), shownNames.find(part => inside(part, row))];
    return pill && name ? [{pill, name}] : [];
  });
  return rows.length > 1 ? [{
    names: [...new Set(rows.map(({name, pill}) => pill.y >= name.y + name.height - 1 ? 'above' : 'beside'))].join(' and '),
    pillEdges: new Set(rows.map(({pill}) => Math.round(pill.x))).size
  }] : [];
};

export const dialGroups = async (page: Page): Promise<DialGroup[]> => {
  const dials = page.getByRole('group').filter({has: page.getByRole('radio')});
  const listsOfDials = page.getByRole('list').filter({has: dials});
  const innermost = await page.getByRole('main').getByRole('list').filter({has: dials}).filter({hasNot: listsOfDials}).all();
  return (await Promise.all(innermost.map(list => groupOf(list, dials)))).flat();
};

export const dialGroupsLaidOutTwoWays = async (page: Page): Promise<DialGroup[]> =>
  (await dialGroups(page)).filter(({names, pillEdges}) => names.includes(' and ') || pillEdges > 1);

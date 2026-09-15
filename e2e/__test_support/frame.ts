import type {FrameLocator, Locator, Page} from '@playwright/test';

export type Stage = {name: string; at: string; table: (page: Page) => Locator | FrameLocator};

export const stages: readonly Stage[] = [
  {name: 'react', at: '/ChosenPicachu/demos/?tab=tables&world=react', table: page => page.getByRole('region', {name: 'live aggregations'})},
  {name: 'vanilla', at: '/ChosenPicachu/demos/?tab=tables&world=vanilla', table: page => page.frameLocator('iframe[title="the living table, in vanilla"]')}
];

type Box = {x: number; y: number; width: number; height: number};

const boxOf = async (locator: Locator): Promise<Box> => {
  const box = await locator.boundingBox();
  if (!box) {
    throw new Error('the element never stood');
  }
  return box;
};

const dragTo = async (page: Page, from: Box, x: number, y: number): Promise<void> => {
  const start = {x: from.x + from.width / 2, y: from.y + from.height / 2};
  await page.mouse.move(start.x, start.y);
  await page.mouse.down();
  for (let step = 1; step <= 16; step++) {
    await page.mouse.move(start.x + (x - start.x) * (step / 16), start.y + (y - start.y) * (step / 16));
  }
  await page.mouse.up();
};

export const dragSortTable = (page: Page, table: Locator | FrameLocator) => {
  const columnHeader = (name: string): Locator => table.getByRole('columnheader', {name});
  return {
    columnHeader,
    columnOrder: (): Promise<(string | null)[]> =>
      table.getByRole('columnheader').evaluateAll(headers => headers.map(header => header.getAttribute('aria-label'))),
    rowOrder: (): Promise<string[]> =>
      table.getByRole('rowheader').evaluateAll(cells =>
        cells.map(cell => cell.getAttribute('aria-label') ?? (cell.textContent ?? '').trim())),
    dragColumnPast: async (column: string, past: string): Promise<void> => {
      const from = await boxOf(columnHeader(column));
      const to = await boxOf(columnHeader(past));
      await dragTo(page, from, to.x + to.width * 0.8, from.y + from.height / 2);
    },
    dragRowPast: async (row: number, past: RegExp): Promise<void> => {
      const grip = await boxOf(table.getByRole('button', {name: `move row ${row}`}));
      const target = await boxOf(table.getByRole('row', {name: past}));
      await dragTo(page, grip, grip.x + grip.width / 2, target.y + target.height * 0.8);
    },
    sortBy: async (column: string, direction: string): Promise<void> => {
      await table.getByRole('button', {name: `sort ${column}`}).click();
      await table.getByRole('button', {name: direction}).click();
    }
  };
};

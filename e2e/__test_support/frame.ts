import type {FrameLocator, Locator, Page} from '@playwright/test';

export type Stage = {name: string; at: string; table: (page: Page) => Locator | FrameLocator};

export const stages: readonly Stage[] = [
  {name: 'react', at: '/ChosenPicachu/demos/?tab=tables&world=react', table: page => page.getByRole('region', {name: 'live aggregations'})},
  {name: 'vanilla', at: '/ChosenPicachu/demos/?tab=tables&world=vanilla', table: page => page.getByTitle('the living table, in vanilla').contentFrame()}
];

type Box = {x: number; y: number; width: number; height: number};

const boxOf = async (locator: Locator): Promise<Box> => {
  const box = await locator.boundingBox();
  if (!box) {
    throw new Error('the element never stood');
  }
  return box;
};

type Point = {x: number; y: number};

const centreOf = ({x, y, width, height}: Box): Point => ({x: x + width / 2, y: y + height / 2});

const carry = async (page: Page, from: Box, to: Point): Promise<void> => {
  const start = centreOf(from);
  await page.mouse.move(start.x, start.y);
  await page.mouse.down();
  for (let step = 1; step <= 16; step++) {
    await page.mouse.move(start.x + (to.x - start.x) * (step / 16), start.y + (to.y - start.y) * (step / 16));
  }
};

const dragTo = async (page: Page, from: Box, x: number, y: number): Promise<void> => {
  await carry(page, from, {x, y});
  await page.mouse.up();
};

export type FingerPress = 'name' | 'middle';

const nameWithin = (header: Locator): Promise<Point> => header.evaluate(cell => {
  const words = document.createTreeWalker(cell, NodeFilter.SHOW_TEXT, {acceptNode: text => (text.textContent ?? '').trim() === '' ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT}).nextNode();
  const range = document.createRange();
  range.selectNodeContents(words ?? cell);
  const word = range.getBoundingClientRect();
  const box = cell.getBoundingClientRect();
  return {x: word.x - box.x + word.width / 2, y: word.y - box.y + word.height / 2};
});

const pressedOn = async (header: Locator, where: FingerPress): Promise<Point> => {
  const box = await boxOf(header);
  if (where === 'middle') {
    return centreOf(box);
  }
  const within = await nameWithin(header);
  return {x: box.x + within.x, y: box.y + within.y};
};

export const dragSortTable = (page: Page, table: Locator | FrameLocator) => {
  const columnHeader = (name: string): Locator => table.getByRole('columnheader', {name});
  const rowGrip = (row: number): Locator => table.getByRole('button', {name: `move row ${row}`});
  const rowHeader = (name: RegExp): Locator => table.getByRole('rowheader', {name});
  const resizeHandle = (name: string): Locator => table.getByRole('button', {name: new RegExp(`^resize ${name}`)});
  const centreOfHandle = async (name: string): Promise<Point> => {
    await resizeHandle(name).scrollIntoViewIfNeeded();
    return centreOf(await boxOf(resizeHandle(name)));
  };
  return {
    columnHeader,
    centreOfColumn: async (name: string): Promise<Point> => centreOf(await boxOf(columnHeader(name))),
    centreOfRow: async (name: RegExp): Promise<Point> => centreOf(await boxOf(table.getByRole('row', {name}))),
    centreOfRowHeader: async (name: RegExp): Promise<Point> => centreOf(await boxOf(rowHeader(name))),
    centreOfRowGrip: async (row: number): Promise<Point> => centreOf(await boxOf(rowGrip(row))),
    fingerDragColumn: async (name: string, {by, from}: {by: number; from: FingerPress}): Promise<void> => {
      const devtools = await page.context().newCDPSession(page);
      await columnHeader(name).scrollIntoViewIfNeeded();
      const pressed = await pressedOn(columnHeader(name), from);
      const touch = (type: 'touchStart' | 'touchMove' | 'touchEnd', x: number): Promise<unknown> =>
        devtools.send('Input.dispatchTouchEvent', {type, touchPoints: type === 'touchEnd' ? [] : [{x, y: pressed.y}]});
      await touch('touchStart', pressed.x);
      for (let step = 1; step <= 20; step++) {
        await touch('touchMove', pressed.x + by * step / 20);
      }
      await touch('touchEnd', pressed.x + by);
    },
    sortToggle: (name: string): Locator => table.getByRole('button', {name: `sort ${name}`}),
    sortMenu: (name: string): Locator => table.getByLabel(`sort ${name} by`),
    pressBesideEdgeAndDrag: async (name: string, {besideBy, by}: {besideBy: number; by: number}): Promise<void> => {
      const handle = resizeHandle(name);
      await handle.scrollIntoViewIfNeeded();
      const edge = await boxOf(handle);
      const from = {...edge, x: edge.x - besideBy};
      await dragTo(page, from, from.x + from.width / 2 + by, from.y + from.height / 2);
    },
    dragEdge: async (name: string, {by, moves}: {by: number; moves: number}): Promise<void> => {
      const middle = await centreOfHandle(name);
      await page.mouse.move(middle.x, middle.y);
      await page.mouse.down();
      await page.mouse.move(middle.x + by, middle.y, {steps: moves});
      await page.mouse.up();
    },
    resizeHandle,
    narrowByKeys: async (name: string, presses: number): Promise<void> => {
      await resizeHandle(name).focus();
      for (let press = 0; press < presses; press++) {
        await page.keyboard.press('ArrowLeft');
      }
    },
    announcedShare: async (name: string): Promise<number> => Number(/, (\d+)%$/.exec(await resizeHandle(name).getAttribute('aria-label') ?? '')?.[1]),
    dragFromWhereHeadersMeet: async (column: string, by: number): Promise<void> => {
      const handle = resizeHandle(column);
      await handle.scrollIntoViewIfNeeded();
      const box = await boxOf(handle);
      const edge = {...box, x: box.x + box.width - 1, width: 0};
      await dragTo(page, edge, edge.x + by, edge.y + edge.height / 2);
    },
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
    listenToTheMoveReport: (): Promise<void> => table.getByRole('status', {name: 'move report'}).evaluate(report => {
      const said: string[] = [];
      new MutationObserver(() => said.push(report.textContent ?? '')).observe(report, {childList: true, characterData: true, subtree: true});
      Reflect.set(globalThis, 'moveReportSaid', said);
    }),
    whatTheMoveReportSaid: (): Promise<unknown[]> => table.getByRole('status', {name: 'move report'}).evaluate(() => {
      const said: unknown = Reflect.get(globalThis, 'moveReportSaid');
      return Array.isArray(said) ? said.filter(text => text !== '') : [];
    }),
    sortBy: async (column: string, direction: string): Promise<void> => {
      await table.getByRole('button', {name: `sort ${column}`}).click();
      await table.getByRole('button', {name: direction}).click();
    }
  };
};

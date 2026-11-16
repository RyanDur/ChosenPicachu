import type {FrameLocator, Locator, Page} from '@playwright/test';
import {siteFrame} from './site';
import {type Box, boxOf} from './box';
import {assertionPatience} from './patience';

export type Stage = {name: string; at: string; holder: (page: Page) => Locator | FrameLocator};

const tablesCard = (page: Page) => {
  const card = page.getByRole('region', {name: 'live aggregations'});
  const vanillaFrame = card.getByTitle('the living table, in vanilla').contentFrame();
  return {
    card,
    vanillaFrame,
    ownTables: card.getByRole('table'),
    vanillaTable: vanillaFrame.getByRole('table')
  };
};

const stages: readonly Stage[] = [
  {name: 'react', at: '/ChosenPicachu/demos/tables/?world=react', holder: page => tablesCard(page).card},
  {name: 'vanilla', at: '/ChosenPicachu/demos/tables/?world=vanilla', holder: page => tablesCard(page).vanillaFrame}
];

const stagesWith = (dials: string): readonly Stage[] =>
  stages.map(stage => ({...stage, name: `${stage.name}, ${dials}`, at: `${stage.at}&${dials}`}));

type Point = {x: number; y: number};

const centerOf = ({x, y, width, height}: Box): Point => ({x: x + width / 2, y: y + height / 2});

const carry = async (page: Page, from: Box, to: Point): Promise<void> => {
  const start = centerOf(from);
  await page.mouse.move(start.x, start.y);
  await page.mouse.down();
  for (let step = 1; step <= 16; step++) {
    await page.mouse.move(start.x + (to.x - start.x) * (step / 16), start.y + (to.y - start.y) * (step / 16));
  }
};

export type Hold = {
  readonly carryTo: (to: Locator) => Promise<void>;
  readonly carryHome: () => Promise<void>;
  readonly drop: () => Promise<void>;
  readonly letGoOutsideThePage: () => Promise<void>;
};

const held = async (page: Page, grip: Locator, along: 'x' | 'y'): Promise<Hold> => {
  await siteFrame(page).hydrated();
  // a carry that runs past the edge of the view scrolls the page under the pointer, which no hand can do
  await grip.evaluate(element => element.scrollIntoView({block: 'center', inline: 'center'}));
  const home = centerOf(await boxOf(grip));
  let at = home;
  const moveTo = async (to: Point): Promise<void> => {
    for (let step = 1; step <= 16; step++) {
      await page.mouse.move(at.x + (to.x - at.x) * (step / 16), at.y + (to.y - at.y) * (step / 16));
    }
    at = to;
  };
  await page.mouse.move(home.x, home.y);
  await page.mouse.down();
  return {
    carryTo: async to => {
      const box = await boxOf(to);
      await moveTo(along === 'x' ? {x: box.x + box.width * 0.8, y: home.y} : {x: home.x, y: box.y + box.height * 0.8});
    },
    carryHome: () => moveTo(home),
    drop: () => page.mouse.up(),
    letGoOutsideThePage: async () => {
      const devtools = await page.context().newCDPSession(page);
      await devtools.send('Input.dispatchMouseEvent', {type: 'mouseMoved', x: at.x, y: at.y, button: 'none', buttons: 0});
    }
  };
};

const dragTo = async (page: Page, from: Box, x: number, y: number): Promise<void> => {
  await siteFrame(page).hydrated();
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
    return centerOf(box);
  }
  const within = await nameWithin(header);
  return {x: box.x + within.x, y: box.y + within.y};
};

const dragSortTable = (page: Page, holder: Locator | FrameLocator) => {
  const columnHeader = (name: string): Locator => holder.getByRole('columnheader', {name});
  const grip = (row: number): Locator => holder.getByRole('button', {name: `move row ${row}`, exact: true});
  const resizeHandle = (name: string): Locator => holder.getByRole('button', {name: new RegExp(`^resize ${name}`)});
  const {hydrated} = siteFrame(page);
  const centerOfHandle = async (name: string): Promise<Point> => {
    await hydrated();
    await resizeHandle(name).scrollIntoViewIfNeeded();
    return centerOf(await boxOf(resizeHandle(name)));
  };
  return {
    columnHeader,
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
    sortToggle: (name: string): Locator => holder.getByRole('button', {name: `sort ${name}`}),
    sortMenu: (name: string): Locator => holder.getByLabel(`sort ${name} by`),
    pressBesideEdgeAndDrag: async (name: string, {besideBy, by}: {besideBy: number; by: number}): Promise<void> => {
      const handle = resizeHandle(name);
      await handle.scrollIntoViewIfNeeded();
      const edge = await boxOf(handle);
      const from = {...edge, x: edge.x - besideBy};
      await dragTo(page, from, from.x + from.width / 2 + by, from.y + from.height / 2);
    },
    dragEdge: async (name: string, {by, moves}: {by: number; moves: number}): Promise<void> => {
      const middle = await centerOfHandle(name);
      await page.mouse.move(middle.x, middle.y);
      await page.mouse.down();
      await page.mouse.move(middle.x + by, middle.y, {steps: moves});
      await page.mouse.up();
    },
    resizeHandle,
    focusHandle: async (name: string): Promise<void> => {
      await hydrated();
      await resizeHandle(name).focus();
    },
    holdHandle: async (
      name: string
    ): Promise<{
      carryTo: (by: number) => Promise<void>;
      carryHome: () => Promise<void>;
      letGo: () => Promise<void>;
    }> => {
      const middle = await centerOfHandle(name);
      await page.mouse.move(middle.x, middle.y);
      await page.mouse.down();
      return {
        carryTo: by => page.mouse.move(middle.x + by, middle.y, {steps: 8}),
        carryHome: () => page.mouse.move(middle.x, middle.y, {steps: 8}),
        letGo: () => page.mouse.up()
      };
    },
    fingerCanceledOnHandle: async (name: string, by: number): Promise<void> => {
      const devtools = await page.context().newCDPSession(page);
      const middle = await centerOfHandle(name);
      await devtools.send('Input.dispatchTouchEvent', {type: 'touchStart', touchPoints: [{x: middle.x, y: middle.y}]});
      for (let step = 1; step <= 8; step++) {
        await devtools.send('Input.dispatchTouchEvent', {type: 'touchMove', touchPoints: [{x: middle.x + by * step / 8, y: middle.y}]});
      }
      await devtools.send('Input.dispatchTouchEvent', {type: 'touchCancel', touchPoints: []});
    },
    hoverAcrossHandle: async (name: string, by: number): Promise<void> => {
      const middle = await centerOfHandle(name);
      await page.mouse.move(middle.x, middle.y);
      await page.mouse.move(middle.x + by, middle.y, {steps: 8});
    },
    narrowByKeys: async (name: string, presses: number): Promise<void> => {
      await hydrated();
      await resizeHandle(name).focus();
      for (let press = 0; press < presses; press++) {
        await page.keyboard.press('ArrowLeft');
      }
    },
    announcedShare: async (name: string): Promise<number> => {
      await hydrated();
      const label = await resizeHandle(name).getAttribute('aria-label') ?? '';
      const share = /, (\d+)%$/.exec(label)?.[1] ?? '';
      if (share === '') throw new Error(`the handle "${label}" names no share`);
      return Number(share);
    },
    dragFromWhereHeadersMeet: async (column: string, by: number): Promise<void> => {
      const handle = resizeHandle(column);
      await handle.scrollIntoViewIfNeeded();
      const box = await boxOf(handle);
      const edge = {...box, x: box.x + box.width - 1, width: 0};
      await dragTo(page, edge, edge.x + by, edge.y + edge.height / 2);
    },
    columnOrder: (): Promise<(string | null)[]> =>
      holder.getByRole('columnheader').evaluateAll(headers => headers.map(header => header.getAttribute('aria-label'))),
    rowOrder: (): Promise<string[]> =>
      holder.getByRole('rowheader').evaluateAll(cells =>
        cells.map(cell => cell.getAttribute('aria-label') ?? (cell.textContent ?? '').trim())),
    holdColumn: (column: string): Promise<Hold> => held(page, columnHeader(column), 'x'),
    holdRow: (row: number): Promise<Hold> => held(page, grip(row), 'y'),
    reading: async (): Promise<string[]> => (await holder.getByRole('table').ariaSnapshot()).split('\n')
      .map(line => line.trim())
      .filter(line => /^- (table|caption|columnheader|rowheader|img)\b/.test(line)),
    row: (name: RegExp): Locator => holder.getByRole('row', {name}),
    moveColumnByKey: async (column: string, key: string): Promise<void> => {
      await hydrated();
      await columnHeader(column).focus();
      await page.keyboard.press(key);
    },
    moveRowByKey: async (row: number, key: string): Promise<void> => {
      await hydrated();
      await grip(row).focus();
      await page.keyboard.press(key);
    },
    dragColumnPast: async (column: string, past: string): Promise<void> => {
      await columnHeader(column).scrollIntoViewIfNeeded();
      const from = await boxOf(columnHeader(column));
      const to = await boxOf(columnHeader(past));
      await dragTo(page, from, to.x + to.width * (to.x < from.x ? 0.2 : 0.8), from.y + from.height / 2);
    },
    dragRowPast: async (row: number, past: RegExp): Promise<void> => {
      await holder.getByRole('row', {name: past}).scrollIntoViewIfNeeded();
      await grip(row).scrollIntoViewIfNeeded();
      const from = await boxOf(grip(row));
      const pastRow = await boxOf(holder.getByRole('row', {name: past}));
      await dragTo(page, from, from.x + from.width / 2, pastRow.y + pastRow.height * 0.8);
    },
    moveReport: (): Locator => holder.getByRole('status', {name: 'move report'}),
    listenToTheMoveReport: async (): Promise<void> => {
      await hydrated();
      await holder.getByRole('status', {name: 'move report'}).evaluate(report => {
        const said: string[] = [];
        new MutationObserver(() => said.push(report.textContent ?? '')).observe(report, {childList: true, characterData: true, subtree: true});
        Reflect.set(globalThis, 'moveReportSaid', said);
      });
    },
    whatTheMoveReportSaid: (): Promise<unknown[]> => holder.getByRole('status', {name: 'move report'}).evaluate(() => {
      const said: unknown = Reflect.get(globalThis, 'moveReportSaid');
      return Array.isArray(said) ? said.filter(text => text !== '') : [];
    }),
    sortBy: async (column: string, direction: string): Promise<void> => {
      await hydrated();
      await holder.getByRole('button', {name: `sort ${column}`}).click();
      await holder.getByRole('button', {name: direction}).click();
    }
  };
};

const opened = async (page: Page, {at, holder}: Pick<Stage, 'at' | 'holder'>) => {
  await page.goto(at);
  const table = dragSortTable(page, holder(page));
  await table.columnHeader('trades').waitFor({timeout: assertionPatience});
  return table;
};

export const tablesFrame = {
  stages,
  stagesWith,
  card: tablesCard,
  dragSortTable,
  opened
};

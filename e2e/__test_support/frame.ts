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

const liesWithin = (inner: Box, outer: Box): boolean =>
  Math.round(inner.x) >= Math.round(outer.x) && Math.round(inner.x + inner.width) <= Math.round(outer.x + outer.width) &&
  Math.round(inner.y) >= Math.round(outer.y) && Math.round(inner.y + inner.height) <= Math.round(outer.y + outer.height);

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

const holdTheSettleAtItsStart = (held: Locator): Promise<void> => held.evaluate(element => {
  element.addEventListener('animationstart', ({target}) => {
    if (target === element) {
      element.getAnimations({subtree: false}).forEach(animation => {
        animation.pause();
        animation.currentTime = 0;
      });
    }
  });
});

const settling = (locator: Locator): Promise<boolean> =>
  locator.evaluate(element => element.getAnimations({subtree: false}).some(({playState}) => playState === 'paused'));

const dropAt = async (page: Page, {pressed, held, watched = held}: {pressed: Locator; held: Locator; watched?: Locator}, letGo: Point): Promise<Point> => {
  await holdTheSettleAtItsStart(watched);
  await carry(page, await boxOf(pressed), letGo);
  const carriedTo = centreOf(await boxOf(held));
  await page.mouse.up();
  return carriedTo;
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

const nextFrame = (locator: Locator): Promise<unknown> => locator.evaluate(() => new Promise(requestAnimationFrame));

const whereItRests = async (locator: Locator): Promise<Point> => {
  let last = centreOf(await boxOf(locator));
  for (let frame = 0; frame < 30; frame++) {
    await nextFrame(locator);
    const now = centreOf(await boxOf(locator));
    if (now.x === last.x && now.y === last.y) {
      return now;
    }
    last = now;
  }
  return last;
};

const heldStill = (held: Locator): Promise<unknown> =>
  held.evaluate(element => Promise.all(element.getAnimations({subtree: false}).map(motion => motion.finished)));

const walk = async (page: Page, {focused, held}: {focused: Locator; held: Locator}, key: string): Promise<void> => {
  await focused.focus();
  await holdTheSettleAtItsStart(held);
  await page.keyboard.press(key);
};

const distanceFrom = (held: Locator, start: Point) => async (): Promise<number> => {
  if (!await settling(held)) {
    return Infinity;
  }
  const {x, y} = centreOf(await boxOf(held));
  return Math.hypot(x - start.x, y - start.y);
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
    howFarTheLiftJumps: async (name: string): Promise<number> => {
      const before = centreOf(await boxOf(columnHeader(name)));
      await page.mouse.move(before.x, before.y);
      await page.mouse.down();
      const lifted = await whereItRests(columnHeader(name));
      await page.mouse.up();
      await heldStill(columnHeader(name));
      return Math.hypot(lifted.x - before.x, lifted.y - before.y);
    },
    howFarTheCarryTrails: async (name: string, {by, steps}: {by: number; steps: number}): Promise<number> => {
      const pressed = centreOf(await boxOf(columnHeader(name)));
      await page.mouse.move(pressed.x, pressed.y);
      await page.mouse.down();
      for (let step = 1; step <= steps; step++) {
        await page.mouse.move(pressed.x + by * step / steps, pressed.y);
      }
      const carried = await whereItRests(columnHeader(name));
      await page.mouse.up();
      await heldStill(columnHeader(name));
      return Math.abs(carried.x - (pressed.x + by));
    },
    howFarAFingersCarryTrails: async (name: string, {by, steps, from}: {by: number; steps: number; from: FingerPress}): Promise<number> => {
      const devtools = await page.context().newCDPSession(page);
      await columnHeader(name).scrollIntoViewIfNeeded();
      const before = centreOf(await boxOf(columnHeader(name)));
      const pressed = await pressedOn(columnHeader(name), from);
      const touch = (type: 'touchStart' | 'touchMove' | 'touchEnd', x: number): Promise<unknown> =>
        devtools.send('Input.dispatchTouchEvent', {type, touchPoints: type === 'touchEnd' ? [] : [{x, y: pressed.y}]});
      await touch('touchStart', pressed.x);
      for (let step = 1; step <= steps; step++) {
        await touch('touchMove', pressed.x + by * step / steps);
      }
      const carried = await whereItRests(columnHeader(name));
      await touch('touchEnd', pressed.x + by);
      await heldStill(columnHeader(name));
      return Math.abs(carried.x - before.x - by);
    },
    dropColumnAt: (name: string, letGo: Point, {watching = name}: {watching?: string} = {}): Promise<Point> =>
      dropAt(page, {pressed: columnHeader(name), held: columnHeader(name), watched: columnHeader(watching)}, letGo),
    dropRowAt: ({row, name}: {row: number; name: RegExp}, letGo: Point, {watching = name}: {watching?: RegExp} = {}): Promise<Point> =>
      dropAt(page, {pressed: rowGrip(row), held: rowHeader(name), watched: rowHeader(watching)}, letGo),
    walkColumn: (name: string, key: string, {watching = name}: {watching?: string} = {}): Promise<void> =>
      walk(page, {focused: columnHeader(name), held: columnHeader(watching)}, key),
    walkRow: ({row, name}: {row: number; name: RegExp}, key: string, {watching = name}: {watching?: RegExp} = {}): Promise<void> =>
      walk(page, {focused: rowGrip(row), held: rowHeader(watching)}, key),
    columnMovesFrom: (name: string, start: Point) => distanceFrom(columnHeader(name), start),
    rowMovesFrom: (name: RegExp, start: Point) => distanceFrom(rowHeader(name), start),
    sortToggle: (name: string): Locator => table.getByRole('button', {name: `sort ${name}`}),
    sortMenu: (name: string): Locator => table.getByLabel(`sort ${name} by`),
    columnWidth: async (name: string): Promise<number> => (await boxOf(columnHeader(name))).width,
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
    controlsPastTheirHeader: async (): Promise<string[]> => {
      const strays: string[] = [];
      for (const header of await table.getByRole('columnheader').all()) {
        const edges = await boxOf(header);
        for (const control of await header.getByRole('button').all()) {
          if (!liesWithin(await boxOf(control), edges)) {
            strays.push(String(await control.getAttribute('aria-label')));
          }
        }
      }
      return strays;
    },
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

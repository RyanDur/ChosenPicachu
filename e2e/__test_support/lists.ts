import type {Locator, Page} from '@playwright/test';
import {fingertipMiss} from './finger';
import {siteFrame} from './site';

type Carried = {
  readonly drop: () => Promise<void>;
};

type Pressed = {
  readonly takenOverByTheBrowser: () => Promise<void>;
};

export const sortableList = (page: Page) => {
  const list = page.getByRole('list', {name: 'sortable list'}).first();
  const items = list.getByRole('listitem');
  const gripNamed = (item: string): Locator => page.getByRole('button', {name: `grip for ${item}`});
  const seatOf = (item: string): Locator => items.filter({has: gripNamed(item)});
  const gripFor = (item: string): Locator => seatOf(item).getByRole('button', {name: `grip for ${item}`});
  const middleOf = async (target: Locator): Promise<{x: number; y: number}> => {
    await list.scrollIntoViewIfNeeded();
    const box = await target.boundingBox();
    if (box === null) throw new Error('the list never stood');
    return {x: box.x + box.width / 2, y: box.y + box.height / 2};
  };
  // the middle of a seat is where the list decides whether a carried item has passed it, and engines round it either way
  const pastTheMiddleOf = async (target: Locator, from: {x: number; y: number}): Promise<{x: number; y: number}> => {
    const middle = await middleOf(target);
    const box = await target.boundingBox();
    if (box === null) throw new Error('the list never stood');
    const along = (start: number, size: number, coming: number, centre: number): number =>
      start + size * (coming < centre ? 0.8 : 0.2);
    return Math.abs(middle.x - from.x) > Math.abs(middle.y - from.y)
      ? {x: along(box.x, box.width, from.x, middle.x), y: middle.y}
      : {x: middle.x, y: along(box.y, box.height, from.y, middle.y)};
  };
  return {
    items,
    seats: (): Promise<string[]> => items.allInnerTexts(),
    item: seatOf,
    moveReport: page.getByRole('status', {name: 'move report'}),
    pressBesideAGripAndDropOnItsNeighbour: async (): Promise<void> => {
      const grip = items.first().getByRole('button', {name: /^grip for/});
      const box = await grip.boundingBox();
      if (box === null) throw new Error('the grip never stood');
      await grip.dragTo(items.nth(1), {force: true, sourcePosition: {x: box.width / 2 + fingertipMiss, y: box.height / 2}});
    },
    // what the engine fired while an item was carried, for a failing journey's report: CI's WebKit is the only engine the carry hangs in
    dragEventsSeen: (): Promise<string> => page.evaluate(() => document.documentElement.dataset.dragLog ?? 'no drag event was heard'),
    carry: async (item: string, onto: string): Promise<Carried> => {
      await siteFrame(page).hydrated();
      const from = await middleOf(gripFor(item));
      const to = await pastTheMiddleOf(seatOf(onto), from);
      await page.evaluate(() => {
        const root = document.documentElement;
        const logged = (event: Event): void => {
          const target = event.target instanceof Element ? `${event.target.tagName.toLowerCase()} ${(event.target.textContent ?? '').trim().slice(0, 16)}` : 'document';
          root.dataset.dragLog = `${root.dataset.dragLog ?? ''}${Math.round(event.timeStamp)} ${event.type} ${target}\n`;
        };
        ['dragstart', 'dragenter', 'dragover', 'dragleave', 'drop', 'dragend'].forEach(type => document.addEventListener(type, logged, true));
      });
      await page.mouse.move(from.x, from.y);
      await page.mouse.down();
      await page.mouse.move(from.x + 10, from.y, {steps: 3});
      await page.mouse.move(to.x, to.y, {steps: 12});
      // a drop only lands where the page has heard a dragover, and a loaded engine can coalesce the moves that would fire one,
      // so the page listens first, and only then does the pointer move within the target to fire one it will hear;
      // WebKit on Linux ends the drag when an eager list moves the carried item's element, and then no dragover can come
      await page.evaluate(() => {
        delete document.documentElement.dataset.dragHeard;
        const heard = (event: DragEvent): void => {
          document.documentElement.dataset.dragHeard = event.type;
        };
        document.addEventListener('dragover', heard, {once: true});
        document.addEventListener('dragend', heard, {once: true});
      });
      await page.mouse.move(to.x + 1, to.y);
      await page.waitForFunction(() => 'dragHeard' in document.documentElement.dataset);
      return {drop: (): Promise<void> => page.mouse.up()};
    },
    fingerOnTheGrip: async (item: string): Promise<Pressed> => {
      await siteFrame(page).hydrated();
      const devtools = await page.context().newCDPSession(page);
      const at = await middleOf(gripFor(item));
      await devtools.send('Input.dispatchTouchEvent', {type: 'touchStart', touchPoints: [at]});
      return {
        takenOverByTheBrowser: async (): Promise<void> => {
          await devtools.send('Input.dispatchTouchEvent', {type: 'touchCancel', touchPoints: []});
        }
      };
    }
  };
};

import {expect, type Locator, type Page} from '@playwright/test';
import {boxOf} from './box';
import {fingertipMiss} from './finger';
import {siteFrame} from './site';

type Carried = {
  readonly carryOnTo: (onto: string) => Promise<void>;
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
    const box = await boxOf(target, 'the list never stood');
    return {x: box.x + box.width / 2, y: box.y + box.height / 2};
  };
  // the middle of a seat is where the list decides whether a carried item has passed it, and engines round it either
  // way
  const pastTheMiddleOf = async (target: Locator, from: {x: number; y: number}): Promise<{x: number; y: number}> => {
    const middle = await middleOf(target);
    const box = await boxOf(target, 'the list never stood');
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
    stepByKey: async (item: string, key: 'ArrowLeft' | 'ArrowRight'): Promise<void> => {
      const grip = gripFor(item);
      await expect(grip).toBeEnabled();
      await grip.focus();
      await page.keyboard.press(key);
    },
    runningSlides: (): Promise<number> => list.evaluate(holder => holder.getAnimations({subtree: true}).length),
    pressBesideAGripAndDropOnItsNeighbour: async (): Promise<void> => {
      const grip = items.first().getByRole('button', {name: /^grip for/});
      const box = await boxOf(grip, 'the grip never stood');
      await grip.dragTo(items.nth(1),
        {force: true, sourcePosition: {x: box.width / 2 + fingertipMiss, y: box.height / 2}});
    },
    // what the engine fired while an item was carried, for a failing journey's report: CI's WebKit is the only engine
    // the carry hangs in
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
      // a drop only lands where the page has heard a dragover. CI's WebKit log showed why one move is not enough: a
      // move onto an element the eager list has just put under the pointer fires dragenter and no dragover, and only a
      // further move over the same element fires one. So the page listens first, and the pointer nudges within the
      // target until it is heard.
      await page.evaluate(() => {
        delete document.documentElement.dataset.dragoverHeard;
        document.addEventListener('dragover', () => {
          document.documentElement.dataset.dragoverHeard = 'yes';
        }, {once: true});
      });
      const nudges = [1, 0, 1, 0, 1, 0, 1, 0];
      let heard = false;
      for (const nudge of nudges) {
        if (heard) break;
        await page.mouse.move(to.x + nudge, to.y);
        heard = await page.waitForFunction(() => 'dragoverHeard' in document.documentElement.dataset, undefined, {timeout: 250})
          .then(() => true, () => false);
      }
      if (!heard) throw new Error(`no dragover was heard at the target after ${nudges.length} nudges`);
      let at = {x: to.x + 1, y: to.y};
      return {
        carryOnTo: async (next: string): Promise<void> => {
          const there = await pastTheMiddleOf(seatOf(next), at);
          await page.mouse.move(there.x, there.y, {steps: 12});
          at = there;
        },
        drop: (): Promise<void> => page.mouse.up()
      };
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

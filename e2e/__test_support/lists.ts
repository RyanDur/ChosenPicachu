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
    carry: async (item: string, onto: string): Promise<Carried> => {
      await siteFrame(page).hydrated();
      const from = await middleOf(gripFor(item));
      const to = await middleOf(seatOf(onto));
      await page.mouse.move(from.x, from.y);
      await page.mouse.down();
      await page.mouse.move(from.x + 10, from.y, {steps: 3});
      await page.mouse.move(to.x, to.y, {steps: 12});
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
    },
    pointerCancelsHeard: async (): Promise<() => Promise<number>> => {
      await page.evaluate(() => {
        document.documentElement.dataset.pointerCancels = '0';
        document.addEventListener('pointercancel', () => {
          document.documentElement.dataset.pointerCancels = String(Number(document.documentElement.dataset.pointerCancels) + 1);
        }, true);
      });
      return async () => Number(await page.evaluate(() => document.documentElement.dataset.pointerCancels));
    }
  };
};

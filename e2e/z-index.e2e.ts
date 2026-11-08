import {Page, expect} from '@playwright/test';
import {maybe} from '@ryandur/sand';
import {test} from './__test_support/journey';
import {type Card, stackingPile} from './__test_support';

test('the z-index cards start in a stack, the button spreads them, and pressing it again stacks them', async ({page}) => {
  await page.goto('demos/z-index/');
  const layers = stackingPile(page).cards();
  const boxes = async () => [await layers.first().boundingBox(), await layers.last().boundingBox()];
  const stacked = async () => {
    const [first, last] = await boxes();
    return maybe(first).and(maybe(last)).map(([top, bottom]) => top.y === bottom.y).orElse(false);
  };
  const spread = async () => {
    const [first, last] = await boxes();
    return maybe(first).and(maybe(last)).map(([top, bottom]) => bottom.y >= top.y + top.height).orElse(false);
  };
  await expect.poll(stacked).toBe(true);

  await stackingPile(page).expand();
  await expect.poll(spread).toBe(true);

  await stackingPile(page).collapse();
  await expect.poll(stacked).toBe(true);
});

test('the pile opens with Third on top, then Second, then First, in the order the code lists them', async ({page}) => {
  await page.goto('demos/z-index/');

  await expect.poll(() => stackingPile(page).cardsFromTheTop()).toEqual(['Third', 'Second', 'First']);
});

const raisedLandsOnTop = async (page: Page, raising: () => Promise<void>, fromTheTop: Card[]): Promise<void> => {
  await page.goto('demos/z-index/');
  await expect.poll(() => stackingPile(page).cardsFromTheTop()).toEqual(['Third', 'Second', 'First']);

  await raising();

  await expect.poll(() => stackingPile(page).cardsFromTheTop()).toEqual(fromTheTop);
};

test('First raised by a pointer lands on top, and the others keep their order under it', ({page}) =>
  raisedLandsOnTop(page, () => stackingPile(page).raise('First'), ['First', 'Third', 'Second']));

test('Second raised by the keyboard lands on top, and the others keep their order under it', ({page}) =>
  raisedLandsOnTop(page, () => stackingPile(page).raiseByKeyboard('Second'), ['Second', 'Third', 'First']));

test('Second raised while the pile is spread comes down on top when it is collapsed', async ({page}) => {
  await page.goto('demos/z-index/');
  const pile = stackingPile(page);
  await pile.expand();

  await pile.raise('Second');
  await pile.collapse();

  await expect.poll(() => pile.cardsFromTheTop()).toEqual(['Second', 'Third', 'First']);
});

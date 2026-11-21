import {Page, expect} from '@playwright/test';
import {test} from './__test_support/journey';
import {type Card, hydration, siteFrame, stackingPile, whichCardIsOnTop} from './__test_support';

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

test('the reader asks for the answer to which card is on top from the keyboard, and hears the question, the answer, then the drawing', async ({page}) => {
  const asking = whichCardIsOnTop(page);
  await page.goto('demos/z-index/why-a-fixed-banner-still-loses/');
  await siteFrame(page).hydrated();
  await expect(asking.answer).toBeHidden();

  await asking.askFromTheKeyboard();

  await expect(asking.answer).toBeVisible();
  await expect.poll(asking.readInOrder).toEqual(['question', 'answer', 'drawing']);
});

test('given the z-index tab before its script runs, the pile’s Expand is disabled; once the script runs, the first press expands the pile', async ({page}) => {
  const address = 'demos/z-index/';
  await hydration(page).holdBack(address);
  await page.goto(address);
  const pile = stackingPile(page);

  await expect(pile.expander).toBeDisabled();
  await hydration(page).release();

  await pile.expander.click();

  await expect(pile.collapser).toBeVisible();
});

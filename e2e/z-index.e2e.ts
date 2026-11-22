import {Page, expect} from '@playwright/test';
import {test} from './__test_support/journey';
import {type Card, hydration, pileSteps, siteFrame, stackingPile, whichCardIsOnTop} from './__test_support';

const partOne = 'demos/z-index/why-third-is-on-top/';

test('the tab’s pile overlaps with Third on top, and says it is on top because it comes last in the code', async ({page}) => {
  const pile = pileSteps(page);
  await page.goto('demos/z-index/');

  await expect.poll(pile.cardsFromTheTop).toEqual(['Third', 'Second', 'First']);
  await expect(pile.verdict).toHaveText('Third is on top. It comes last in the code.');
  await expect(pile.html).toBeVisible();
  await expect(pile.css).toContainText('position: absolute;');
});

const givenAZIndexLandsOnTop = async (page: Page, giving: () => Promise<void>, fromTheTop: Card[]): Promise<void> => {
  const pile = pileSteps(page);
  await page.goto('demos/z-index/');
  await pile.stepsTo('2 · Z-index');

  await giving();

  await expect.poll(pile.cardsFromTheTop).toEqual(fromTheTop);
  await expect(pile.verdict).toHaveText(`${fromTheTop[0]} is on top. Its z-index outranks the order in the code.`);
  await expect(pile.css).toContainText('z-index: 1;');
};

test('First given a z-index by a pointer comes to the top of the tab’s pile, with the rule that did it', ({page}) =>
  givenAZIndexLandsOnTop(page, () => pileSteps(page).givesAZIndexTo('First'), ['First', 'Third', 'Second']));

test('a copied address opens the tab’s pile on the step it names', async ({page}) => {
  const pile = pileSteps(page);

  await page.goto('demos/z-index/?pile=z-index');

  await expect(pile.step('2 · Z-index')).toBeChecked();
  await expect(pile.verdict).toHaveText('Third is on top. It comes last in the code.');
});

test('Back steps the tab’s pile back to the step before', async ({page}) => {
  const pile = pileSteps(page);
  await page.goto('demos/z-index/');
  await pile.stepsTo('2 · Z-index');
  await expect(pile.step('2 · Z-index')).toBeChecked();

  await page.goBack();

  await expect(pile.step('1 · Overlap')).toBeChecked();
});

test('Second given a z-index by the keyboard comes to the top of the tab’s pile, with the rule that did it', ({page}) =>
  givenAZIndexLandsOnTop(page, () => pileSteps(page).givesAZIndexByKeyboardTo('Second'), ['Second', 'Third', 'First']));

test('taking First’s z-index away puts Third back on top of the tab’s pile', async ({page}) => {
  const pile = pileSteps(page);
  await page.goto('demos/z-index/?raised=first');
  await expect.poll(pile.cardsFromTheTop).toEqual(['First', 'Third', 'Second']);

  await pile.givesAZIndexTo('None');

  await expect.poll(pile.cardsFromTheTop).toEqual(['Third', 'Second', 'First']);
  await expect(pile.css).not.toContainText('z-index');
});

test('First raised while part one’s pile is spread covers no other card, so the raise changes nothing the reader sees', async ({page}) => {
  await page.goto(partOne);
  const pile = stackingPile(page);
  await pile.expand();

  await pile.raise('First');

  await expect(page).toHaveURL(/\?raised=first$/);
  await expect.poll(pile.cardsFromTheTopAtEachCard).toEqual([['First'], ['Second'], ['Third']]);
});

test('Second raised while part one’s pile is spread comes down on top when it is collapsed', async ({page}) => {
  await page.goto(partOne);
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

test('given part one before its script runs, the pile’s Expand is disabled; once the script runs, the first press expands the pile', async ({page}) => {
  await hydration(page).holdBack(partOne);
  await page.goto(partOne);
  const pile = stackingPile(page);

  await expect(pile.expander).toBeDisabled();
  await hydration(page).release();

  await pile.expander.click();

  await expect(pile.collapser).toBeVisible();
});

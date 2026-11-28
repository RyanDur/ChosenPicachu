import {Page, expect} from '@playwright/test';
import {test} from './__test_support/journey';
import {type Card, hydration, pileSteps, siteFrame, stackingPile, whichCardIsOnTop} from './__test_support';

const partOne = 'demos/z-index/why-third-is-on-top/';

test('the tab’s pile opens on its cards running down the page, none over another, with First at the top and Third at the bottom', async ({page}) => {
  const pile = pileSteps(page);

  await page.goto('demos/z-index/');

  await expect(pile.step('1 · Block')).toBeChecked();
  await expect.poll(pile.howTheCardsSit).toBe('down the page');
  await expect(pile.verdict).toHaveText('First is at the top and Third is at the bottom.');
});

test('stepping the tab’s pile to inline sets its cards along one line, with the tag that changed in its HTML', async ({page}) => {
  const pile = pileSteps(page);
  await page.goto('demos/z-index/');

  await pile.stepsTo('2 · Inline');

  await expect.poll(pile.howTheCardsSit).toBe('along a line');
  await expect(pile.verdict).toHaveText('First is first on the line and Third is last.');
  await expect(pile.html).toContainText('<span>First</span>');
});

test('stepping the tab’s pile on from inline to the overlap draws the cards over one another, with Third on top', async ({page}) => {
  const pile = pileSteps(page);
  await page.goto('demos/z-index/?pile=inline');

  await pile.stepsTo('3 · Overlap');

  await expect.poll(pile.cardsFromTheTop).toEqual(['Third', 'Second', 'First']);
  await expect(pile.verdict).toHaveText('Third is on top. It comes last in the code.');
  await expect(pile.css).toContainText('position: absolute;');
});

test('stepping the tab’s pile back from a z-index to inline takes the card raised out of the address', async ({page}) => {
  const pile = pileSteps(page);
  await page.goto('demos/z-index/?pile=z-index&raised=first');

  await pile.stepsTo('2 · Inline');

  await expect(page).toHaveURL(/[?&]pile=inline$/);
  await expect(page).not.toHaveURL(/raised=/);
});

const givenAZIndexLandsOnTop = async (page: Page, giving: () => Promise<void>, fromTheTop: Card[]): Promise<void> => {
  const pile = pileSteps(page);
  await page.goto('demos/z-index/');
  await pile.stepsTo('4 · Z-index');

  await giving();

  await expect.poll(pile.cardsFromTheTop).toEqual(fromTheTop);
  await expect(pile.verdict).toHaveText(`${fromTheTop[0]} is on top. Its z-index outranks the order in the code.`);
  await expect(pile.css).toContainText('z-index: 1;');
};

test('First given a z-index by a pointer comes to the top of the tab’s pile, with the rule that did it', ({page}) =>
  givenAZIndexLandsOnTop(page, () => pileSteps(page).givesAZIndexTo('First'), ['First', 'Third', 'Second']));

test('Third given a z-index stays on top of the tab’s pile, and the sentence says its z-index and its place in the code agree', async ({page}) => {
  const pile = pileSteps(page);
  await page.goto('demos/z-index/');
  await pile.stepsTo('4 · Z-index');

  await pile.givesAZIndexTo('Third');

  await expect.poll(pile.cardsFromTheTop).toEqual(['Third', 'Second', 'First']);
  await expect(pile.verdict).toHaveText('Third is on top. Its z-index and its place in the code agree.');
});

test('a copied address opens the tab’s pile on the step it names', async ({page}) => {
  const pile = pileSteps(page);

  await page.goto('demos/z-index/?pile=z-index');

  await expect(pile.step('4 · Z-index')).toBeChecked();
  await expect(pile.verdict).toHaveText('Third is on top. It comes last in the code.');
});

test('Back steps the tab’s pile back to the step before', async ({page}) => {
  const pile = pileSteps(page);
  await page.goto('demos/z-index/?pile=overlap');
  await pile.stepsTo('4 · Z-index');
  await expect(pile.step('4 · Z-index')).toBeChecked();

  await page.goBack();

  await expect(pile.step('3 · Overlap')).toBeChecked();
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

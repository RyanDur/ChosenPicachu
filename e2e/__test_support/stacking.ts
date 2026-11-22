import type {Locator, Page} from '@playwright/test';
import {maybe} from '@ryandur/sand';
import {pillSwitch} from './pills';
import {siteFrame} from './site';

export type Card = 'First' | 'Second' | 'Third';
export type Step = 'Overlap' | 'Z-index';

const order: ('None' | Card)[] = ['None', 'First', 'Second', 'Third'];

const cardsFromTheTopWhereAllMeet = (drawing: Locator): Promise<string[]> => drawing.evaluate(pile => {
  pile.scrollIntoView({block: 'center'});
  const cards = [...pile.children];
  const boxes = cards.map(card => card.getBoundingClientRect());
  const left = Math.max(...boxes.map(box => box.left));
  const right = Math.min(...boxes.map(box => box.right));
  const top = Math.max(...boxes.map(box => box.top));
  const bottom = Math.min(...boxes.map(box => box.bottom));
  return document.elementsFromPoint((left + right) / 2, (top + bottom) / 2)
    .filter(element => cards.includes(element))
    .map(found => found.textContent ?? '');
});

export const pileSteps = (page: Page) => {
  const exhibit = page.getByRole('figure', {name: 'The pile', exact: true});
  return {
    cardsFromTheTop: (): Promise<string[]> => cardsFromTheTopWhereAllMeet(exhibit.getByRole('region', {name: 'the pile'})),
    stepsTo: (step: Step): Promise<void> => pillSwitch(page, 'Step').choose(step),
    givesAZIndexTo: (card: 'None' | Card): Promise<void> => pillSwitch(page, 'Give a z-index to').choose(card),
    givesAZIndexByKeyboardTo: async (card: Card): Promise<void> => {
      await pillSwitch(page, 'Give a z-index to').pill('None').focus();
      for (let step = 0; step < order.indexOf(card); step += 1) {
        await page.keyboard.press('ArrowRight');
      }
    },
    css: exhibit.getByRole('figure').filter({hasText: /^CSS/}),
    html: exhibit.getByRole('figure').filter({hasText: /^HTML/}),
    verdict: exhibit.getByRole('status')
  };
};

export const stackingPile = (page: Page) => {
  const pile = page.getByRole('figure', {name: /^The pile\./});
  const raisedGroup = pile.getByRole('group', {name: 'card raised'});
  const expander = pile.getByRole('button', {name: 'Expand'});
  const cardsFromTheTopAtEachCard = (): Promise<string[][]> => pile.getByRole('list').evaluate(list => {
    list.scrollIntoView({block: 'center'});
    const cards = [...list.children];
    return cards.map(card => {
      const {left, top, width, height} = card.getBoundingClientRect();
      return document.elementsFromPoint(left + width / 2, top + height / 2)
        .filter(element => cards.includes(element))
        .map(found => found.textContent ?? '');
    });
  });
  return {
    expander,
    collapser: pile.getByRole('button', {name: 'Collapse'}),
    cardsFromTheTopAtEachCard,
    cardsFromTheTop: async (): Promise<string[]> => maybe((await cardsFromTheTopAtEachCard()).at(-1)).orElse([]),
    raise: async (card: Card): Promise<void> => {
      await siteFrame(page).hydrated();
      await raisedGroup.getByText(card, {exact: true}).click();
    },
    raiseByKeyboard: async (card: Card): Promise<void> => {
      await siteFrame(page).hydrated();
      await raisedGroup.getByRole('radio', {name: 'None'}).focus();
      for (let step = 0; step < order.indexOf(card); step += 1) {
        await page.keyboard.press('ArrowRight');
      }
    },
    expand: async (): Promise<void> => {
      await siteFrame(page).hydrated();
      await expander.click();
    },
    collapse: async (): Promise<void> => {
      await siteFrame(page).hydrated();
      await pile.getByRole('button', {name: 'Collapse'}).click();
    }
  };
};

import type {Page} from '@playwright/test';
import {maybe} from '@ryandur/sand';
import {siteFrame} from './site';

export type Card = 'First' | 'Second' | 'Third';

const order: ('None' | Card)[] = ['None', 'First', 'Second', 'Third'];

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

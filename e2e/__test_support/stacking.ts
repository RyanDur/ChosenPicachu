import type {Page} from '@playwright/test';

export type Card = 'First' | 'Second' | 'Third';

const order: ('None' | Card)[] = ['None', 'First', 'Second', 'Third'];

export const stackingPile = (page: Page) => {
  const pile = page.getByRole('figure', {name: /^The pile\./});
  const raisedGroup = pile.getByRole('group', {name: 'card raised'});
  return {
    cards: () => pile.getByRole('listitem'),
    cardsFromTheTop: (): Promise<string[]> => pile.getByRole('list').evaluate(list => {
      const cards = [...list.children];
      const {left, top, width, height} = cards[cards.length - 1].getBoundingClientRect();
      return document.elementsFromPoint(left + width / 2, top + height / 2)
        .filter(element => cards.includes(element))
        .map(card => card.textContent ?? '');
    }),
    raise: (card: Card): Promise<void> => raisedGroup.getByText(card, {exact: true}).click(),
    raiseByKeyboard: async (card: Card): Promise<void> => {
      await raisedGroup.getByRole('radio', {name: 'None'}).focus();
      for (let step = 0; step < order.indexOf(card); step += 1) {
        await page.keyboard.press('ArrowRight');
      }
    },
    expand: (): Promise<void> => pile.getByRole('button', {name: 'Expand'}).click(),
    collapse: (): Promise<void> => pile.getByRole('button', {name: 'Collapse'}).click()
  };
};

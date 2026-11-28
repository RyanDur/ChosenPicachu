import type {Locator, Page} from '@playwright/test';
import {maybe} from '@ryandur/sand';
import {pillSwitch} from './pills';
import {siteFrame} from './site';

export type Card = 'First' | 'Second' | 'Third';
export type Step = '1 · Block' | '2 · Inline' | '3 · Overlap' | '4 · Z-index';
type HowTheCardsSit = 'down the page' | 'along a line' | 'overlapping' | 'neither';

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

const howTheCardsSitIn = (drawing: Locator): Promise<HowTheCardsSit> => drawing.evaluate((drawn): HowTheCardsSit => {
  drawn.scrollIntoView({block: 'center'});
  const boxes = [...drawn.children]
    .filter(child => ['First', 'Second', 'Third'].includes(child.textContent ?? ''))
    .map(card => card.getBoundingClientRect());
  const overlap = (one: DOMRect, other: DOMRect): boolean =>
    one.left < other.right && other.left < one.right && one.top < other.bottom && other.top < one.bottom;
  if (boxes.some((box, at) => boxes.slice(at + 1).some(other => overlap(box, other)))) return 'overlapping';
  if (boxes.every(box => Math.round(box.top) === Math.round(boxes[0].top))) return 'along a line';
  if (boxes.every((box, at) => at === 0 || box.top >= boxes[at - 1].bottom)) return 'down the page';
  return 'neither';
});

export const pileSteps = (page: Page) => {
  const exhibit = page.getByRole('region', {name: 'The pile', exact: true});
  return {
    cardsFromTheTop: (): Promise<string[]> => cardsFromTheTopWhereAllMeet(exhibit.getByRole('region', {name: /^What the browser draws/})),
    howTheCardsSit: (): Promise<HowTheCardsSit> => howTheCardsSitIn(exhibit.getByRole('region', {name: /^What the browser draws/})),
    stepsTo: (step: Step): Promise<void> => pillSwitch(page, 'Step').choose(step),
    step: (step: Step): Locator => pillSwitch(page, 'Step').pill(step),
    givesAZIndexTo: (card: 'None' | Card): Promise<void> => pillSwitch(page, 'Give a z-index to').choose(card),
    givesAZIndexByKeyboardTo: async (card: Card): Promise<void> => {
      await siteFrame(page).hydrated();
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
  const pile = page.getByRole('region', {name: 'The pile'});
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

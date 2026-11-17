import {is} from '@ryandur/sand';
import {screen, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const named = {name: /^The trap\./};
const find = (): Promise<HTMLElement> => screen.findByRole('figure', named);
const cardOneHasZIndexBox = (trap: HTMLElement): HTMLElement =>
  within(trap).getByRole('checkbox', {name: 'Card one has z-index: 1'});

export const theTrap = {
  find,
  figure: (): HTMLElement => screen.getByRole('figure', named),
  query: (): HTMLElement | null => screen.queryByRole('figure', named),
  cardOne: (trap: HTMLElement): HTMLElement => within(trap).getAllByRole('listitem')
    .filter(card => is(within(card).queryByRole('button', {name: 'Sort by, the old way'})))[0],
  controlIn: (card: HTMLElement, name: string): HTMLElement => within(card).getByRole('button', {name}),
  cardOneHasZIndexBox,
  controls: (trap: HTMLElement): HTMLElement[] =>
    [...within(trap).getAllByRole('button'), cardOneHasZIndexBox(trap)],
  toggleCardOne: async (): Promise<void> => userEvent.click(cardOneHasZIndexBox(await find()))
};

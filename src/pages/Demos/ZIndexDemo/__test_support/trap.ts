import {screen, within} from '@testing-library/react';

export const theTrap = {
  find: (): Promise<HTMLElement> => screen.findByRole('figure', {name: /^The trap\./}),
  cardOne: (trap: HTMLElement): HTMLElement => within(trap).getAllByRole('listitem')
    .filter(card => within(card).queryByRole('button', {name: 'Sort by, the old way'}) !== null)[0],
  buttonIn: (card: HTMLElement, name: string): HTMLElement => within(card).getByRole('button', {name}),
  cardOneHasZIndexBox: (trap: HTMLElement): HTMLElement => within(trap).getByRole('checkbox', {name: 'Card one has z-index: 1'})
};

import {screen, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const card = (raised: HTMLElement, name: string): HTMLElement => within(raised).getByRole('radio', {name});

export const stackingPile = {
  findCardRaised: (): Promise<HTMLElement> => screen.findByRole('group', {name: 'card raised'}),
  card,
  raise: async (raised: HTMLElement, name: string): Promise<void> => userEvent.click(card(raised, name))
};

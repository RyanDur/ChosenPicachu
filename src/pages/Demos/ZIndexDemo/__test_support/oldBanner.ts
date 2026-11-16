import {screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const oldWords = /^An old banner\./;
const findRaiser = (): Promise<HTMLElement> => screen.findByRole('button', {name: 'Raise a banner, the old way'});

export const oldBanner = {
  findRaiser,
  raiser: (): HTMLElement => screen.getByRole('button', {name: 'Raise a banner, the old way'}),
  raise: async (): Promise<void> => userEvent.click(await findRaiser()),
  raiseByKeyboard: async (): Promise<void> => {
    (await findRaiser()).focus();
    await userEvent.keyboard('{Enter}');
  },
  tab: async (): Promise<void> => userEvent.tab(),
  dismissButton: (): HTMLElement => screen.getByRole('button', {name: 'dismiss the old banner'}),
  pressEnter: async (): Promise<void> => {
    await userEvent.keyboard('{Enter}');
  },
  shown: (): HTMLElement => screen.getByText(oldWords),
  query: (): HTMLElement | null => screen.queryByText(oldWords)
};

import {screen, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const standingIn = (pile: HTMLElement): HTMLElement[] =>
  within(pile).queryAllByRole('button', {name: /^dismiss /, hidden: true});

export const topLayerBanners = {
  pile: (): HTMLElement => screen.getByRole('alert', {hidden: true}),
  standingIn,
  raise: async (): Promise<void> => userEvent.click(await screen.findByRole('button', {name: 'Raise a banner, in the top layer'}))
};

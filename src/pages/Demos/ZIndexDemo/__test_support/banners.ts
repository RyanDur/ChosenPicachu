import {screen, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const standingIn = (pile: HTMLElement): HTMLElement[] =>
  within(pile).queryAllByRole('button', {name: /^dismiss /});

export const siteBanners = {
  pile: (): Promise<HTMLElement> => screen.findByRole('alert'),
  standingIn,
  raise: async (): Promise<void> => userEvent.click(within(
    await screen.findByRole('region', {name: 'The banner, at the window’s edge'})
  ).getByRole('button', {name: 'Raise a banner'}))
};

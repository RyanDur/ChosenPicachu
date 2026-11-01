import {fireEvent, screen, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const standingIn = (pile: HTMLElement): HTMLElement[] =>
  within(pile).queryAllByRole('button', {name: /^dismiss /, hidden: true});

export const topLayerBanners = {
  pile: (): HTMLElement => screen.getByRole('alert', {hidden: true}),
  standingIn,
  raise: async (): Promise<void> => userEvent.click(await screen.findByRole('button', {name: 'Raise a banner, in the top layer'})),
  dismissNewest: async (pile: HTMLElement): Promise<void> => {
    const standing = standingIn(pile);
    const newest = standing[standing.length - 1];
    const item = within(pile).getAllByRole('listitem', {hidden: true}).find(banner => banner.contains(newest));
    if (!item) {
      throw new Error('the raised trouble stands in no list item');
    }
    await userEvent.click(newest);
    // jsdom runs no transitions, so the pile's closing gap never ends on its own
    fireEvent.transitionEnd(item, {propertyName: 'grid-template-rows'});
  }
};

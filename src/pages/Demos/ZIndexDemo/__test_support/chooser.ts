import {screen, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {computeAccessibleName} from 'dom-accessibility-api';

const wear = (chooser: HTMLElement, worn: string): HTMLElement => within(chooser).getByRole('radio', {name: worn});

export const wearsChooser = {
  find: (): Promise<HTMLElement> => screen.findByRole('figure', {name: /^What card one wears decides/}),
  wearsOffered: (chooser: HTMLElement): string[] =>
    within(within(chooser).getByRole('group', {name: 'What card one wears'})).getAllByRole('radio').map(choice => computeAccessibleName(choice)),
  wear,
  putOn: async (chooser: HTMLElement, worn: string): Promise<void> => userEvent.click(wear(chooser, worn)),
  pressSortBy: async (chooser: HTMLElement): Promise<void> =>
    userEvent.click(within(chooser).getByRole('button', {name: 'Sort by, the old way'})),
  closeTheList: async (): Promise<void> => {
    await userEvent.keyboard('{Escape}');
  },
  formed: (chooser: HTMLElement): HTMLElement => within(chooser).getByRole('status', {name: 'what card one formed'})
};

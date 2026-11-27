import {screen, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {computeAccessibleName} from 'dom-accessibility-api';

const named = {name: 'What card one wears'};

const wear = (chooser: HTMLElement, worn: string): HTMLElement => within(chooser).getByRole('radio', {name: worn});

export const wearsChooser = {
  find: (): Promise<HTMLElement> => screen.findByRole('region', named),
  region: (): HTMLElement => screen.getByRole('region', named),
  query: (): HTMLElement | null => screen.queryByRole('region', named),
  wearsOffered: (chooser: HTMLElement): string[] =>
    within(within(chooser).getByRole('group', {name: 'What card one wears'})).getAllByRole('radio').map(choice => computeAccessibleName(choice)),
  wear,
  putOn: async (chooser: HTMLElement, worn: string): Promise<void> => userEvent.click(wear(chooser, worn)),
  pressSortBy: async (chooser: HTMLElement): Promise<void> =>
    userEvent.click(within(chooser).getByRole('button', {name: 'Sort by, the old way'})),
  closeTheList: async (): Promise<void> => {
    await userEvent.keyboard('{Escape}');
  },
  formed: (chooser: HTMLElement): HTMLElement => within(chooser).getByRole('status', {name: 'what card one formed'}),
  controls: (chooser: HTMLElement): HTMLElement[] =>
    [...within(chooser).getAllByRole('radio'), ...within(chooser).getAllByRole('button')]
};

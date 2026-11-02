import {screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const chooser = (): HTMLElement => screen.getByRole('combobox', {name: 'Add a friend'});

const removal = (name: string): HTMLElement => screen.getByRole('button', {name: `remove ${name}`});

export const friendsList = {
  friendsOf: (owner: string): HTMLElement => screen.getByRole('group', {name: `friends of ${owner}`}),
  friends: (): HTMLElement => screen.getByRole('list', {name: 'friends'}),
  report: (): HTMLElement => screen.getByRole('status', {name: 'friends report'}),

  chooser,
  chooserIfAny: (): HTMLElement | null => screen.queryByRole('combobox', {name: 'Add a friend'}),
  add: (name: string): Promise<void> => userEvent.selectOptions(chooser(), [name]),

  removal,
  removalIfAny: (name: string): HTMLElement | null => screen.queryByRole('button', {name: `remove ${name}`}),
  remove: (name: string): Promise<void> => userEvent.click(removal(name)),
  removeByKey: async (name: string, key: string): Promise<void> => {
    removal(name).focus();
    await userEvent.keyboard(key);
  }
};

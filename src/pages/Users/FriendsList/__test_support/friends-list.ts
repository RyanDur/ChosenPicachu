import {within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

export const friendsList = (row: HTMLElement) => {
  const inRow = within(row);
  const chooser = (): HTMLElement => inRow.getByRole('combobox', {name: 'Add a friend'});
  const removal = (name: string): HTMLElement => inRow.getByRole('button', {name: `remove ${name}`});
  return {
    friendsOf: (owner: string): HTMLElement => inRow.getByRole('group', {name: `friends of ${owner}`}),
    friends: (): HTMLElement => inRow.getByRole('list', {name: 'friends'}),
    report: (): HTMLElement => inRow.getByRole('status', {name: 'friends report'}),

    chooser,
    chooserIfAny: (): HTMLElement | null => inRow.queryByRole('combobox', {name: 'Add a friend'}),
    add: (name: string): Promise<void> => userEvent.selectOptions(chooser(), [name]),

    removalIfAny: (name: string): HTMLElement | null => inRow.queryByRole('button', {name: `remove ${name}`}),
    remove: (name: string): Promise<void> => userEvent.click(removal(name)),
    removeByKey: async (name: string, key: string): Promise<void> => {
      removal(name).focus();
      await userEvent.keyboard(key);
    }
  };
};

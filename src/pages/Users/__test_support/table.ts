import {screen, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const table = (): HTMLElement => screen.getByRole('table');

const rowOf = (name: string): Promise<HTMLElement> =>
  within(table()).findByRole('row', {name: heard => heard.startsWith(name)});

const rows = (): HTMLElement[] =>
  within(table()).getAllByRole('row').filter(row => within(row).queryByRole('rowheader') !== null);

const names = (): string[] => rows().map(row => within(row).getByRole('rowheader').textContent ?? '');

const worksFromHome = (row: HTMLElement): string =>
  ['Yes', 'No'].find(answer => within(row).queryByRole('cell', {name: answer}) !== null) ?? '';

const actionOn = async (name: string, action: string, role: 'link' | 'button'): Promise<void> =>
  userEvent.click(within(await rowOf(name)).getByRole(role, {name: action, hidden: true}));

const friendRemoval = (row: HTMLElement, friend: string): HTMLElement =>
  within(row).getByRole('button', {name: `remove ${friend}`});

const friendChooser = (row: HTMLElement): HTMLElement => within(row).getByRole('combobox', {name: 'Add a friend'});

export const usersTable = {
  rowOf,
  rows,
  names,

  roster: async (): Promise<string[]> => {
    await within(table()).findAllByRole('rowheader');
    return names();
  },

  worksFromHome,

  grips: (): HTMLElement[] => within(table()).getAllByRole('button', {name: /move row/}),
  grip: async (name: string): Promise<HTMLElement> => within(await rowOf(name)).getByRole('button', {name: /move row/}),
  moveByKey: async (name: string, key: string): Promise<void> => {
    within(await rowOf(name)).getByRole('button', {name: /move row/}).focus();
    await userEvent.keyboard(key);
  },
  moveReport: (): HTMLElement => screen.getByRole('status', {name: 'move report'}),

  resizeHandles: (column: string): HTMLElement[] =>
    within(table()).getAllByRole('button', {name: new RegExp(`resize ${column}`)}),

  sortMenu: (column: string): HTMLElement | null => within(table()).queryByRole('button', {name: `sort ${column}`}),

  titled: (name: string): HTMLElement => screen.getByRole('table', {name}),

  addNewUser: (): HTMLElement => screen.getByRole('link', {name: 'Add New User'}),
  addNewUserIfAny: (): HTMLElement | null => screen.queryByRole('link', {name: 'Add New User'}),

  friendRemoval,
  friendRemovalIfAny: (row: HTMLElement, friend: string): HTMLElement | null =>
    within(row).queryByRole('button', {name: `remove ${friend}`}),
  friendChooser,
  unfriend: (row: HTMLElement, friend: string): Promise<void> => userEvent.click(friendRemoval(row, friend)),
  befriend: (row: HTMLElement, friend: string): Promise<void> => userEvent.selectOptions(friendChooser(row), [friend]),

  worksFromHomeColumn: (): string[] => rows().map(worksFromHome),

  sortWorksFromHome: async (direction: string): Promise<void> => {
    const menu = screen.getByLabelText('sort works-from-home by');
    await userEvent.click(within(menu).getByRole('button', {name: direction, hidden: true}));
  },

  edit: (name: string): Promise<void> => actionOn(name, 'Edit', 'link'),
  clone: (name: string): Promise<void> => actionOn(name, 'Clone', 'link'),
  remove: (name: string): Promise<void> => actionOn(name, 'Remove', 'button')
};

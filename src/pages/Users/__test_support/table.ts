import {screen, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {User} from '@components/Users/UserInfo/types';

export const fullName = ({info}: User): string => `${info.firstName} ${info.lastName}`;

const usersTable = (): HTMLElement => screen.getByRole('table');

export const rowOf = (name: string): Promise<HTMLElement> =>
  within(usersTable()).findByRole('row', {name: heard => heard.startsWith(name)});

export const rows = (): HTMLElement[] =>
  within(usersTable()).getAllByRole('row').filter(row => within(row).queryByRole('rowheader') !== null);

export const names = (): string[] => rows().map(row => within(row).getByRole('rowheader').textContent ?? '');

export const roster = async (): Promise<string[]> => {
  await within(usersTable()).findAllByRole('rowheader');
  return names();
};

export const worksFromHome = (row: HTMLElement): string =>
  ['Yes', 'No'].find(answer => within(row).queryByRole('cell', {name: answer}) !== null) ?? '';

export const worksFromHomeColumn = (): string[] => rows().map(worksFromHome);

export const sortWorksFromHome = async (direction: string): Promise<void> => {
  const menu = screen.getByLabelText('sort works-from-home by');
  await userEvent.click(within(menu).getByRole('button', {name: direction, hidden: true}));
};

const actionOn = async (name: string, action: string, role: 'link' | 'button'): Promise<void> =>
  userEvent.click(within(await rowOf(name)).getByRole(role, {name: action, hidden: true}));

export const view = (name: string): Promise<void> => actionOn(name, 'View', 'link');
export const edit = (name: string): Promise<void> => actionOn(name, 'Edit', 'link');
export const clone = (name: string): Promise<void> => actionOn(name, 'Clone', 'link');
export const remove = (name: string): Promise<void> => actionOn(name, 'Remove', 'button');

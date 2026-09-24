import {screen, within} from '@testing-library/react';
import {liftedRow, rowsSurveyed} from '@components/DragSortableTable/__test_support';
import userEvent from '@testing-library/user-event';

const table = (): HTMLElement => screen.getByRole('table');
const sortable = (): HTMLTableElement => {
  const found = table();
  if (!(found instanceof HTMLTableElement)) throw new Error('the roster is not a table');
  return found;
};

const rowOf = (name: string): Promise<HTMLElement> =>
  within(table()).findByRole('row', {name: heard => heard.startsWith(name)});

const rows = (): HTMLElement[] =>
  within(table()).getAllByRole('row').filter(row => within(row).queryByRole('rowheader') !== null);

const names = (): string[] => rows().map(row => within(row).getByRole('rowheader').textContent ?? '');

const worksFromHome = (row: HTMLElement): string =>
  ['Yes', 'No'].find(answer => within(row).queryByRole('cell', {name: answer}) !== null) ?? '';

const actionOn = async (name: string, action: string, role: 'link' | 'button'): Promise<void> =>
  userEvent.click(within(await rowOf(name)).getByRole(role, {name: action, hidden: true}));

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
  dragPast: async (name: string, past: string): Promise<void> => {
    const grip = within(await rowOf(name)).getByRole('button', {name: /move row/});
    rowsSurveyed(sortable());
    const held = liftedRow(grip, names().indexOf(name));
    held.carriedOver(names().indexOf(name), names().indexOf(past));
    held.dropped();
  },

  resizeHandles: (column: string): HTMLElement[] =>
    within(table()).getAllByRole('button', {name: new RegExp(`resize ${column}`)}),

  sortMenu: (column: string): HTMLElement | null => within(table()).queryByRole('button', {name: `sort ${column}`}),

  addNewUser: (): HTMLElement => screen.getByRole('link', {name: 'Add New User'}),

  worksFromHomeColumn: (): string[] => rows().map(worksFromHome),

  sortWorksFromHome: async (direction: string): Promise<void> => {
    const menu = screen.getByLabelText('sort works-from-home by');
    await userEvent.click(within(menu).getByRole('button', {name: direction, hidden: true}));
  },

  edit: (name: string): Promise<void> => actionOn(name, 'Edit', 'link'),
  clone: (name: string): Promise<void> => actionOn(name, 'Clone', 'link'),
  remove: (name: string): Promise<void> => actionOn(name, 'Remove', 'button')
};

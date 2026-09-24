import {screen, within, fireEvent} from '@testing-library/react';
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

const rect = (box: Partial<DOMRect>): DOMRect => ({
  left: 0, right: 0, top: 0, bottom: 0, width: 0, height: 0, x: 0, y: 0, toJSON: () => ({}), ...box
});

const surveyed = (): void => {
  const height = 40 + rows().length * 40;
  table().getBoundingClientRect = () => rect({left: 0, right: 700, width: 700, top: 0, bottom: height, height});
  within(table()).getAllByRole('columnheader').forEach(head => {
    head.getBoundingClientRect = () => rect({width: 100});
  });
  rows().forEach((lane, at) => {
    lane.getBoundingClientRect = () => rect({left: 0, right: 700, width: 700, top: 40 + at * 40, y: 40 + at * 40, bottom: 80 + at * 40, height: 40});
  });
};

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
  dropBelow: async (name: string, below: string): Promise<void> => {
    surveyed();
    const grip = within(await rowOf(name)).getByRole('button', {name: /move row/});
    const landing = names().indexOf(below);
    fireEvent.pointerDown(grip, {clientX: 100, clientY: 50, pointerId: 1});
    fireEvent.pointerMove(grip, {buttons: 1, clientX: 100, clientY: 40 + landing * 40 + 30, pointerId: 1});
    fireEvent.pointerUp(grip, {pointerId: 1});
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

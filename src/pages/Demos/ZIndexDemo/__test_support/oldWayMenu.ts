import {screen, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {theTrap} from './trap';

const unchosen = 'Sort by, the old way';
const findButton = async (name: string = unchosen): Promise<HTMLElement> =>
  within(await theTrap.find()).findByRole('button', {name});
const press = async (key: string): Promise<void> => {
  await userEvent.keyboard(key);
};

export const oldWayMenu = {
  findButton,
  button: (name: string = unchosen): HTMLElement => within(theTrap.region()).getByRole('button', {name}),
  open: async (name: string = unchosen): Promise<void> => userEvent.click(await findButton(name)),
  focusButton: async (): Promise<void> => (await findButton()).focus(),
  openWithEnter: async (): Promise<void> => press('{Enter}'),
  openWithArrowDown: async (): Promise<void> => press('{ArrowDown}'),
  next: async (): Promise<void> => press('{ArrowDown}'),
  previous: async (): Promise<void> => press('{ArrowUp}'),
  first: async (): Promise<void> => press('{Home}'),
  last: async (): Promise<void> => press('{End}'),
  takeByKeyboard: async (): Promise<void> => press('{Enter}'),
  close: async (): Promise<void> => press('{Escape}'),
  tabAway: async (): Promise<void> => userEvent.tab(),
  choices: (): string[] => within(screen.getByRole('menu')).getAllByRole('menuitem').map(choice => choice.textContent),
  choice: (name: string): HTMLElement => screen.getByRole('menuitem', {name}),
  choose: async (name: string): Promise<void> => userEvent.click(screen.getByRole('menuitem', {name})),
  currentChoice: (): HTMLElement => screen.getByRole('menuitem', {current: true}),
  queryMenu: (): HTMLElement | null => screen.queryByRole('menu'),
  whereItOpened: (): HTMLElement => screen.getByRole('status', {name: 'where the list opened'}),
  findWhereItOpened: (): Promise<HTMLElement> => screen.findByRole('status', {name: 'where the list opened'})
};

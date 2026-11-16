import {screen, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {theTrap} from './trap';

const unchosen = 'Sort by, the old way';
const findButton = async (name: string = unchosen): Promise<HTMLElement> =>
  within(await theTrap.find()).findByRole('button', {name});
const cardOneBox = (): Promise<HTMLElement> => screen.findByRole('checkbox', {name: 'Card one has z-index: 1'});

export const oldWayMenu = {
  findButton,
  open: async (name: string = unchosen): Promise<void> => userEvent.click(await findButton(name)),
  focusButton: async (): Promise<void> => (await findButton()).focus(),
  press: async (keys: string): Promise<void> => {
    await userEvent.keyboard(keys);
  },
  tabAway: async (): Promise<void> => userEvent.tab(),
  choices: (): string[] => within(screen.getByRole('menu')).getAllByRole('menuitem').map(choice => choice.textContent),
  choice: (name: string): HTMLElement => screen.getByRole('menuitem', {name}),
  choose: async (name: string): Promise<void> => userEvent.click(screen.getByRole('menuitem', {name})),
  currentChoice: (): HTMLElement => screen.getByRole('menuitem', {current: true}),
  queryMenu: (): HTMLElement | null => screen.queryByRole('menu'),
  whereItOpened: (): HTMLElement => screen.getByRole('status', {name: 'where the list opened'}),
  findWhereItOpened: (): Promise<HTMLElement> => screen.findByRole('status', {name: 'where the list opened'}),
  cardOneBox,
  toggleCardOne: async (): Promise<void> => userEvent.click(await cardOneBox())
};

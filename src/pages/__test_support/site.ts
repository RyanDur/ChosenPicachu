import {not} from '@ryandur/sand';
import {screen, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const room = (): HTMLElement => screen.getByRole('main');

export const site = {
  room,
  roomSays: (words: string): Promise<HTMLElement> => within(room()).findByText(words),
  roomLinks: (): HTMLElement[] => within(room()).queryAllByRole('link'),
  pageTitle: (): HTMLElement => screen.getByRole('heading', {level: 1}),
  pageTitled: (): Promise<HTMLElement> => screen.findByRole('heading', {level: 1}),
  titled: (name: string): Promise<HTMLElement> => screen.findByRole('heading', {level: 1, name}),
  nav: (): Promise<HTMLElement> => screen.findByRole('navigation', {name: 'site'}),
  main: (): HTMLElement => screen.getByRole('main'),
  asideIfAny: (): HTMLElement | null => screen.queryByRole('complementary'),
  errorsReported: (): HTMLElement => screen.getByRole('list', {name: 'errors reported'}),
  railNames: async (): Promise<string[]> =>
    within(await screen.findByRole('navigation', {name: 'site'})).getAllByRole('link').map(link => link.textContent),
  currentPages: async (): Promise<string[]> =>
    within(await screen.findByRole('navigation', {name: 'site'})).findAllByRole('link', {current: 'page'})
      .then(links => links.map(link => link.textContent)),
  arrivedAt: async (name: string): Promise<HTMLElement> =>
    within(await screen.findByRole('navigation', {name: 'site'})).findByRole('link', {name, current: 'page'}),
  railHoldsTheNav: async (): Promise<HTMLElement> => within(await screen.findByRole('region', {name: 'pages and feedback'})).getByRole('navigation', {name: 'site'}),
  railHoldsFeedback: async (): Promise<HTMLElement> => within(await screen.findByRole('region', {name: 'pages and feedback'})).getByRole('button', {name: 'Feedback'}),
  unmarkedRail: async (): Promise<boolean> =>
    not(within(await screen.findByRole('navigation', {name: 'site'})).queryAllByRole('link', {current: 'page'}).length),
  railLink: (name: string): HTMLElement => within(screen.getByRole('navigation', {name: 'site'})).getByRole('link', {name}),
  followRail: async (name: string): Promise<void> => userEvent.click(within(await screen.findByRole('navigation', {name: 'site'})).getByRole('link', {name})),
  rail: (): Promise<HTMLElement> => screen.findByRole('region', {name: 'pages and feedback'}),
  closedRoomIfAny: (): HTMLElement | null => screen.queryByText('This room is closed.'),
  frontDoor: (): HTMLElement => screen.getByRole('link', {name: 'Back to the front door'}),
  announced: (words: string): HTMLElement => within(screen.getByRole('alert')).getByText(words),
  announcedIfAny: (words: string): HTMLElement | null =>
    screen.queryAllByRole('alert').flatMap(alert => within(alert).queryAllByText(words))[0] ?? null
};

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
  railLinks: async (): Promise<HTMLElement[]> => within(await screen.findByRole('navigation', {name: 'site'})).getAllByRole('link'),
  railLink: (name: string): HTMLElement => within(screen.getByRole('navigation', {name: 'site'})).getByRole('link', {name}),
  followRail: async (name: string): Promise<void> => userEvent.click(within(await screen.findByRole('navigation', {name: 'site'})).getByRole('link', {name})),
  rail: (): Promise<HTMLElement> => screen.findByRole('region', {name: 'pages and feedback'}),
  closedRoomIfAny: (): HTMLElement | null => screen.queryByText('This room is closed.'),
  frontDoor: (): HTMLElement => screen.getByRole('link', {name: 'Back to the front door'}),
  announced: (words: string): HTMLElement => within(screen.getByRole('alert', {hidden: true})).getByText(words)
};

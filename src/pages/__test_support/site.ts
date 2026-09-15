import {screen, within} from '@testing-library/react';

const room = (): HTMLElement => screen.getByRole('main');

export const site = {
  room,
  roomSays: (words: string): Promise<HTMLElement> => within(room()).findByText(words),
  pageTitle: (): HTMLElement => screen.getByRole('heading', {level: 1}),
  pageTitled: (): Promise<HTMLElement> => screen.findByRole('heading', {level: 1}),
  rail: (): Promise<HTMLElement> => screen.findByRole('navigation', {name: 'site'}),
  frontDoor: (): HTMLElement => screen.getByRole('link', {name: 'Back to the front door'}),
  announced: (words: string): HTMLElement => within(screen.getByRole('alert', {hidden: true})).getByText(words),
  signpost: (words: RegExp): HTMLElement => screen.getByRole('link', {name: words})
};

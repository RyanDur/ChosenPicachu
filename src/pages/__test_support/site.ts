import {screen, within} from '@testing-library/react';

export const room = (): HTMLElement => screen.getByRole('main');

export const roomSays = (words: string): Promise<HTMLElement> => within(room()).findByText(words);

export const pageTitle = (): HTMLElement => screen.getByRole('heading', {level: 1});

export const pageTitled = (): Promise<HTMLElement> => screen.findByRole('heading', {level: 1});

export const siteRail = (): Promise<HTMLElement> => screen.findByRole('navigation', {name: 'site'});

export const frontDoor = (): HTMLElement => screen.getByRole('link', {name: 'Back to the front door'});

export const announced = (words: string): HTMLElement =>
  within(screen.getByRole('alert', {hidden: true})).getByText(words);

export const followSignpost = (words: RegExp): HTMLElement => screen.getByRole('link', {name: words});

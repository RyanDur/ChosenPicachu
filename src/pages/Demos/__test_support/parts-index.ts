import {is} from '@ryandur/sand';
import {screen, within} from '@testing-library/react';

export const partsIndex = {
  find: (): Promise<HTMLElement> => screen.findByRole('navigation', {name: 'Parts'}),
  title: (): Promise<HTMLElement> => screen.findByRole('heading', {name: 'Parts', level: 2}),
  titlesIn: (index: HTMLElement): string[] => within(index).getAllByRole('link').map(link => link.textContent),
  currentIn: (index: HTMLElement): HTMLElement => within(index).getByRole('link', {current: 'page'}),
  addressesIn: (index: HTMLElement): (string | null)[] =>
    within(index).getAllByRole('link').map(link => link.getAttribute('href')),
  entryOf: (index: HTMLElement, title: string): HTMLElement =>
    within(index).getAllByRole('listitem').filter(entry => is(within(entry).queryByRole('link', {name: title})))[0]
};

import {is} from '@ryandur/sand';
import {screen, within} from '@testing-library/react';

export const partsIndex = {
  find: (): Promise<HTMLElement> => screen.findByRole('navigation', {name: 'Parts'}),
  titlesIn: (index: HTMLElement): string[] => within(index).getAllByRole('link').map(link => link.textContent),
  entryOf: (index: HTMLElement, title: string): HTMLElement =>
    within(index).getAllByRole('listitem').filter(entry => is(within(entry).queryByRole('link', {name: title})))[0]
};

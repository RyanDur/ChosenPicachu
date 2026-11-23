import {screen, within} from '@testing-library/react';

export const bannerExhibit = {
  find: (): Promise<HTMLElement> => screen.findByRole('region', {name: 'The banners'}),
  button: (exhibit: HTMLElement, name: string): HTMLElement => within(exhibit).getByRole('button', {name}),
  controls: (exhibit: HTMLElement): HTMLElement[] => within(exhibit).getAllByRole('button')
};

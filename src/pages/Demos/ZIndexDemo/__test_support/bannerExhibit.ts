import {screen, within} from '@testing-library/react';

export const bannerExhibit = {
  find: (): Promise<HTMLElement> => screen.findByRole('figure', {name: /^The banners\./}),
  button: (exhibit: HTMLElement, name: string): HTMLElement => within(exhibit).getByRole('button', {name})
};

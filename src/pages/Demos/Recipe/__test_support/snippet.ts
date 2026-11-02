import {screen, within} from '@testing-library/react';

const fileLinks = (): HTMLElement[] => within(screen.getByRole('figure')).queryAllByRole('link');

export const codeSample = {
  fileLink: (name: string): HTMLElement => within(screen.getByRole('figure')).getByRole('link', {name}),
  fileNames: (): string[] => fileLinks().map(({textContent}) => textContent ?? ''),
  fileAddresses: (): (string | null)[] => fileLinks().map(link => link.getAttribute('href'))
};

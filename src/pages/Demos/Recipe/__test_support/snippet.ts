import {screen, within} from '@testing-library/react';
import {computeAccessibleName} from 'dom-accessibility-api';

const fileLinks = (): HTMLElement[] => within(screen.getByRole('figure')).queryAllByRole('link');

export const codeSample = {
  fileLink: (name: string): HTMLElement => within(screen.getByRole('figure')).getByRole('link', {name}),
  source: (): string => computeAccessibleName(screen.getByRole('figure')),
  fileNames: (): string[] => fileLinks().map(({textContent}) => textContent ?? ''),
  fileAddresses: (): (string | null)[] => fileLinks().map(link => link.getAttribute('href')),
  code: (): string[] => (within(screen.getByRole('figure')).getByRole('code').textContent ?? '').split('\n').slice(0, -1),
  marked: (): string[] => within(screen.getByRole('figure')).queryAllByRole('mark').map(({textContent}) => textContent ?? '')
};

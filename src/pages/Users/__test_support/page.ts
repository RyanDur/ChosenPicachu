import {screen, within} from '@testing-library/react';

export const usersPage = {
  says: (words: string): Promise<HTMLElement> => within(screen.getByRole('alert', {hidden: true})).findByText(words),
  region: (name: string): HTMLElement => screen.getByRole('region', {name})
};

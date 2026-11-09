import {screen, within} from '@testing-library/react';

export const usersPage = {
  says: async (words: string): Promise<HTMLElement> => within(await screen.findByRole('alert')).findByText(words),
  alertIfAny: (): HTMLElement | null => screen.queryByRole('alert'),
  region: (name: string): HTMLElement => screen.getByRole('region', {name})
};

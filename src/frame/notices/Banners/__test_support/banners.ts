import {screen, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

export const banners = {
  raise: async (trouble = screen.getByRole('button', {name: 'trouble'})): Promise<void> => userEvent.click(trouble),
  raisers: (): HTMLElement[] => screen.getAllByRole('button', {name: 'trouble'}),
  saying: (message: string): HTMLElement[] => within(screen.getByRole('alert')).getAllByText(message),
  panel: (): HTMLElement | null => screen.queryByRole('alert', {hidden: true})
};

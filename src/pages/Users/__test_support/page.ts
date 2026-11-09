import {screen, waitFor, within} from '@testing-library/react';

export const usersPage = {
  says: async (words: string): Promise<HTMLElement> => within(await screen.findByRole('alert')).findByText(words),
  alertIfAny: (): HTMLElement | null => screen.queryByRole('alert'),
  region: (name: string): HTMLElement => screen.getByRole('region', {name}),
  // React's act check lifts only inside RTL's async wrapper, and waitFor is the public way in;
  // waitFor times itself out on the held clock, so its timeout must outlast the wait
  waitsOut: async (milliseconds: number): Promise<void> => {
    await waitFor(() => vi.advanceTimersByTimeAsync(milliseconds), {timeout: milliseconds + 1000});
  }
};

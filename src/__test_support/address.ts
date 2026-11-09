import {screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const path = (): HTMLElement => screen.getByRole('status', {name: 'url path'});
const search = (): HTMLElement => screen.getByRole('status', {name: 'url search'});

const shown = (): string => `${path().textContent}${search().textContent}`;

export const appAddress = {
  back: async (): Promise<void> => userEvent.click(screen.getByRole('button', {name: 'browser back'})),
  shown,
  path,
  search,
  fragment: (): string => screen.getByRole('status', {name: 'url fragment'}).textContent,
  drawn: async (): Promise<string> => {
    await screen.findByRole('status', {name: 'url path'});
    return shown();
  },
  movedOnFrom: (from: string): Promise<string> => waitFor(() => {
    const now = shown();
    if (now === from) throw new Error(`the app is still at ${from}`);
    return now;
  })
};

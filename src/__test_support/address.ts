import {screen, waitFor} from '@testing-library/react';

const shown = (): string =>
  `${screen.getByRole('status', {name: 'url path'}).textContent}${screen.getByRole('status', {name: 'url search'}).textContent}`;

export const appAddress = {
  shown,
  movedOnFrom: (from: string): Promise<string> => waitFor(() => {
    const now = shown();
    if (now === from) throw new Error(`the app is still at ${from}`);
    return now;
  })
};

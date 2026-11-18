import {screen, waitForOptions, within} from '@testing-library/react';

export const bookMap = (name: string, patience?: waitForOptions) => {
  const theMap = (): Promise<HTMLElement> => screen.findByRole('navigation', {name}, patience);
  return {
    says: (): Promise<HTMLElement> => screen.findByText(/about \d+ minutes/, {}, patience),
    saysInside: async (): Promise<HTMLElement> => within(await theMap()).getByText(/about \d+ minutes/),
    listed: (): HTMLElement | null => screen.queryByRole('navigation', {name}),
    signposts: async (): Promise<(string | null)[][]> =>
      within(await theMap()).getAllByRole('listitem').map(entry =>
        [entry.textContent, within(entry).queryByRole('link')?.getAttribute('href') ?? null]),
    current: async (): Promise<HTMLElement> => within(await theMap()).getByRole('link', {current: 'page'})
  };
};

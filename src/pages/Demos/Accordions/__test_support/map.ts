import {screen, within} from '@testing-library/react';

const theMap = (): Promise<HTMLElement> => screen.findByRole('navigation', {name: 'the accordions map'});

export const accordionsMap = {
  says: (): Promise<HTMLElement> => screen.findByText(/about \d+ minutes/),
  saysInTheMap: async (): Promise<HTMLElement> => within(await theMap()).getByText(/about \d+ minutes/),
  listed: (): HTMLElement | null => screen.queryByRole('navigation', {name: 'the accordions map'}),
  signposts: async (): Promise<(string | null)[][]> =>
    within(await theMap()).getAllByRole('listitem').map(entry =>
      [entry.textContent, within(entry).queryByRole('link')?.getAttribute('href') ?? null]),
  current: async (): Promise<HTMLElement> => within(await theMap()).getByRole('link', {current: 'page'})
};

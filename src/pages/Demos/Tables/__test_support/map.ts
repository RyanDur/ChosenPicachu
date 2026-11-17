import {screen, within} from '@testing-library/react';
import {untilTheTablesTabRenders} from './controls';

const theMap = (): Promise<HTMLElement> =>
  screen.findByRole('navigation', {name: 'the tables map'}, untilTheTablesTabRenders);

export const tablesMap = {
  says: (): Promise<HTMLElement> => screen.findByText(/about \d+ minutes/, {}, untilTheTablesTabRenders),
  listed: (): HTMLElement | null => screen.queryByRole('navigation', {name: 'the tables map'}),
  signposts: async (): Promise<(string | null)[][]> =>
    within(await theMap()).getAllByRole('listitem').map(entry =>
      [entry.textContent, within(entry).queryByRole('link')?.getAttribute('href') ?? null]),
  current: async (): Promise<HTMLElement> =>
    within(await theMap()).getByText((_, element) => element?.getAttribute('aria-current') === 'page')
};

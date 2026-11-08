import {screen, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const refusal = 'the museum refused to answer';
const loading = {name: 'loading piece'};

export const piecePage = {
  loadingAppears: (): Promise<HTMLElement> => screen.findByRole('progressbar', loading),
  loadingIfAny: (): HTMLElement | null => screen.queryByRole('progressbar', loading),
  title: (): HTMLElement => screen.getByRole('heading', {level: 1}),
  search: (): HTMLElement => screen.getByRole('combobox', {name: /Search For/}),
  leave: (): Promise<void> => userEvent.click(screen.getByRole('link', {name: 'Home'})),
  artistAppears: (artist: string): Promise<HTMLElement> => screen.findByText(artist),
  artist: (artist: string): HTMLElement => screen.getByText(artist),
  refusalAppears: (): Promise<HTMLElement> => screen.findByAltText(refusal),
  easel: (): HTMLElement => screen.getByRole('figure'),
  easelIfAny: (): HTMLElement | null => screen.queryByRole('figure'),
  troubleSays: async (words: string): Promise<HTMLElement> => within(await screen.findByRole('alert')).getByText(words)
};

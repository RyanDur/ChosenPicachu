import {screen, within} from '@testing-library/react';

const refusal = 'the museum refused to answer';
const loading = {name: 'loading piece'};

export const piecePage = {
  loadingAppears: (): Promise<HTMLElement> => screen.findByRole('progressbar', loading),
  loadingIfAny: (): HTMLElement | null => screen.queryByRole('progressbar', loading),
  title: (): HTMLElement => screen.getByRole('heading', {level: 1}),
  artistAppears: (artist: string): Promise<HTMLElement> => screen.findByText(artist),
  artist: (artist: string): HTMLElement => screen.getByText(artist),
  refusalAppears: (): Promise<HTMLElement> => screen.findByAltText(refusal),
  refusalIfAny: (): HTMLElement | null => screen.queryByAltText(refusal),
  easelIfAny: (): HTMLElement | null => screen.queryByRole('figure'),
  troubleSaid: (words: string): HTMLElement => within(screen.getByRole('alert', {hidden: true})).getByText(words)
};

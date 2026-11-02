import {screen, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

export const galleryPage = {
  headerShows: (title: string): Promise<HTMLElement> => within(screen.getByRole('banner')).findByText(title),
  artistShown: (artist: string): Promise<HTMLElement> => screen.findByText(artist),
  easel: (): HTMLElement | null => screen.queryByRole('figure'),
  title: (): HTMLElement => screen.getByRole('heading', {level: 1}),
  pieceLoadingAppears: (): Promise<HTMLElement> => screen.findByRole('progressbar', {name: 'loading piece'}),
  backToTheWall: async (): Promise<void> => userEvent.click(screen.getByRole('link', {name: 'Gallery'})),
  museumsAppear: (): Promise<HTMLElement> => screen.findByRole('navigation', {name: 'museums'}),
  museumsIfAny: (): HTMLElement | null => screen.queryByRole('navigation', {name: 'museums'}),
  museumAppears: (name: string): Promise<HTMLElement> => screen.findByRole('link', {name}),
  museum: (name: string): HTMLElement => screen.getByRole('link', {name}),
  museumIfAny: (name: string): HTMLElement | null => screen.queryByRole('link', {name}),
  currentMuseum: (name: string): Promise<HTMLElement> => screen.findByRole('link', {name, current: 'page'}),
  enter: async (name: string): Promise<void> => userEvent.click(await screen.findByRole('link', {name})),
  emptyWallIfAny: (): HTMLElement | null => screen.queryByAltText('the museum answered with nothing'),
  noMuseumOpen: (): Promise<HTMLElement> => screen.findByAltText('no museum is open'),
  urlSearch: (): HTMLElement => screen.getByRole('status', {name: 'url search'}),
  pagination: (): HTMLElement => screen.getByRole('navigation', {name: 'pagination'}),
  nextPage: (): Promise<void> => userEvent.click(screen.getByRole('link', {name: 'NEXT'}))
};

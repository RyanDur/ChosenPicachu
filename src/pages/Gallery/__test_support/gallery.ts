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
  museumAppears: (name: string): Promise<HTMLElement> => screen.findByRole('link', {name}),
  wallsLoading: (): HTMLElement[] => screen.queryAllByRole('progressbar', {name: 'loading gallery'})
};
